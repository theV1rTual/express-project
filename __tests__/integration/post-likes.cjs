const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const request = require('supertest');
const { setupApp } = require('../../dist/setup-app');
const { PostDbModel } = require('../../dist/posts/types/PostDbModel');
const { UserDbModel } = require('../../dist/users/types/UserDbModel');
const { BlogDbModel } = require('../../dist/blogs/types/BlogDbModel');
const { jwtService } = require('../../dist/auth/adapters/jwt.service');
const {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
} = require('../../dist/auth/middlewares/super-admin.guard-middleware');
// Explicitly opt in to an isolated database. Never use the application's default URI.
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
function assertSubset(actual, expected) {
  for (const [key, value] of Object.entries(expected))
    assert.deepEqual(actual[key], value);
}
if (!process.env.TEST_MONGO_URL) {
  throw new Error(
    'Set TEST_MONGO_URL to a local MongoDB URI; tests create and drop their own database.',
  );
}
describe('Post reactions (HTTP + MongoDB)', { timeout: 30000 }, () => {
  const app = express();
  const admin = `Basic ${Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64')}`;
  const blogId = new ObjectId();
  const users = Array.from({ length: 8 }, (_, i) => ({
    _id: new ObjectId(),
    login: `liker${i}`,
    email: `liker${i}@example.com`,
  }));
  let tokens;
  before(async () => {
    await mongoose.connect(process.env.TEST_MONGO_URL, {
      dbName: `post_likes_test_${process.pid}_${Date.now()}`,
      serverSelectionTimeoutMS: 3000,
    });
    setupApp(app);
    await BlogDbModel.collection.insertOne({
      _id: blogId,
      name: 'Likes blog',
      description: 'Test',
      websiteUrl: 'https://example.com',
      createdAt: new Date(),
      isMembership: false,
    });
    await UserDbModel.insertMany(
      users.map((user) => ({
        ...user,
        createdAt: new Date(),
        passwordHash: 'test-only-hash',
        emailConfirmation: {
          confirmationCode: 'test',
          expirationDate: new Date(),
          isConfirmed: true,
        },
        passwordRecovery: { recoveryCode: null, expirationDate: null },
        refreshToken: null,
      })),
    );
    tokens = await Promise.all(
      users.map((user) => jwtService.createAccessToken(user._id.toString())),
    );
  });
  after(async () => {
    if (mongoose.connection.readyState === 1)
      await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
  async function createPost() {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', admin)
      .send({
        title: 'Post',
        shortDescription: 'Description',
        content: 'Content',
        blogId: blogId.toString(),
      })
      .expect(201);
    return response.body;
  }
  function react(postId, user, likeStatus) {
    return request(app)
      .put(`/posts/${postId}/like-status`)
      .set('Authorization', `Bearer ${tokens[user]}`)
      .send({ likeStatus });
  }
  it('returns empty extendedLikesInfo from both post creation endpoints', async () => {
    const empty = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    assert.deepEqual((await createPost()).extendedLikesInfo, empty);
    const response = await request(app)
      .post(`/blogs/${blogId}/posts`)
      .set('Authorization', admin)
      .send({
        title: 'Blog post',
        shortDescription: 'Description',
        content: 'Content',
      })
      .expect(201);
    assert.deepEqual(response.body.extendedLikesInfo, empty);
  });
  it('validates authentication, status and post identity', async () => {
    const post = await createPost();
    await request(app)
      .put(`/posts/${post.id}/like-status`)
      .send({ likeStatus: 'Like' })
      .expect(401);
    await request(app)
      .put(`/posts/${post.id}/like-status`)
      .set('Authorization', 'Bearer invalid')
      .send({ likeStatus: 'Like' })
      .expect(401);
    for (const likeStatus of ['invalid', null, 1, {}, undefined]) {
      const response = await request(app)
        .put(`/posts/${post.id}/like-status`)
        .set('Authorization', `Bearer ${tokens[0]}`)
        .send({ likeStatus })
        .expect(400);
      assert.equal(response.body.errorsMessages[0].field, 'likeStatus');
    }
    await react(new ObjectId().toString(), 0, 'Like').expect(404);
    await react('bad-id', 0, 'Like').expect(404);
    const missingUserToken = await jwtService.createAccessToken(
      new ObjectId().toString(),
    );
    await request(app)
      .put(`/posts/${post.id}/like-status`)
      .set('Authorization', `Bearer ${missingUserToken}`)
      .send({ likeStatus: 'Like' })
      .expect(401);
  });
  const statuses = ['None', 'Like', 'Dislike'];
  for (const from of statuses)
    for (const to of statuses) {
      it(`handles ${from} -> ${to} without duplicate reactions`, async () => {
        const post = await createPost();
        await react(post.id, 0, from).expect(204);
        await react(post.id, 0, to).expect(204);
        const response = await request(app)
          .get(`/posts/${post.id}`)
          .set('Authorization', `Bearer ${tokens[0]}`)
          .expect(200);
        assertSubset(response.body.extendedLikesInfo, {
          likesCount: to === 'Like' ? 1 : 0,
          dislikesCount: to === 'Dislike' ? 1 : 0,
          myStatus: to,
        });
        const stored = await PostDbModel.findById(post.id).lean();
        assert.equal(stored.likes.length, to === 'None' ? 0 : 1);
      });
    }
  it('personalizes single posts, all posts and blog posts, and permits guest reads', async () => {
    const post = await createPost();
    await react(post.id, 0, 'Like').expect(204);
    await react(post.id, 1, 'Dislike').expect(204);
    for (const path of [
      `/posts/${post.id}`,
      '/posts?pageSize=100',
      `/blogs/${blogId}/posts?pageSize=100`,
    ]) {
      for (const [token, expected] of [
        [tokens[0], 'Like'],
        [tokens[1], 'Dislike'],
        ['', 'None'],
        ['invalid', 'None'],
      ]) {
        const req = request(app).get(path);
        if (token) req.set('Authorization', `Bearer ${token}`);
        const response = await req.expect(200);
        const item =
          response.body.items?.find((item) => item.id === post.id) ??
          response.body;
        assertSubset(item.extendedLikesInfo, {
          likesCount: 1,
          dislikesCount: 1,
          myStatus: expected,
        });
        assert.equal(item.likes, undefined);
      }
    }
  });
  it('returns the latest three active likes and preserves timestamps on identical requests', async () => {
    const post = await createPost();
    for (let i = 0; i < 4; i++) {
      await react(post.id, i, 'Like').expect(204);
      await PostDbModel.updateOne(
        { _id: new ObjectId(post.id), 'likes.userId': users[i]._id.toString() },
        { $set: { 'likes.$.addedAt': new Date(Date.UTC(2020, 0, i + 1)) } },
      );
    }
    const before = await request(app).get(`/posts/${post.id}`).expect(200);
    assert.deepEqual(
      before.body.extendedLikesInfo.newestLikes.map((like) => like.login),
      ['liker3', 'liker2', 'liker1'],
    );
    assert.deepEqual(before.body.extendedLikesInfo.newestLikes[0], {
      addedAt: '2020-01-04T00:00:00.000Z',
      userId: users[3]._id.toString(),
      login: 'liker3',
    });
    await react(post.id, 1, 'Like').expect(204);
    const repeated = await request(app).get(`/posts/${post.id}`).expect(200);
    assert.deepEqual(
      repeated.body.extendedLikesInfo,
      before.body.extendedLikesInfo,
    );
    await react(post.id, 3, 'Dislike').expect(204);
    await react(post.id, 2, 'None').expect(204);
    const removed = await request(app).get(`/posts/${post.id}`).expect(200);
    assert.deepEqual(
      removed.body.extendedLikesInfo.newestLikes.map((like) => like.login),
      ['liker1', 'liker0'],
    );
    await react(post.id, 3, 'Like').expect(204);
    const restored = await request(app).get(`/posts/${post.id}`).expect(200);
    assert.deepEqual(
      restored.body.extendedLikesInfo.newestLikes.map((like) => like.login),
      ['liker3', 'liker1', 'liker0'],
    );
  });
  it('does not lose concurrent likes and does not duplicate the same user', async () => {
    const post = await createPost();
    await Promise.all(
      users.flatMap((_, i) => [
        react(post.id, i, 'Like').expect(204),
        react(post.id, i, 'Like').expect(204),
      ]),
    );
    const response = await request(app).get(`/posts/${post.id}`).expect(200);
    assert.equal(response.body.extendedLikesInfo.likesCount, users.length);
    const stored = await PostDbModel.findById(post.id).lean();
    assert.equal(
      new Set(stored.likes.map((like) => like.userId)).size,
      users.length,
    );
    assert.equal(stored.likes.length, users.length);
  });
  it('handles legacy posts without the likes field', async () => {
    const id = new ObjectId();
    await PostDbModel.collection.insertOne({
      _id: id,
      title: 'Legacy',
      shortDescription: 'Legacy',
      content: 'Legacy',
      blogId: blogId.toString(),
      blogName: 'Likes blog',
      createdAt: new Date().toISOString(),
    });
    const response = await request(app).get(`/posts/${id}`).expect(200);
    assert.equal(response.body.extendedLikesInfo.likesCount, 0);
    await react(id.toString(), 0, 'Like').expect(204);
    const updated = await request(app).get(`/posts/${id}`).expect(200);
    assert.equal(updated.body.extendedLikesInfo.likesCount, 1);
  });
});
