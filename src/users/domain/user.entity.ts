import { randomUUID } from "crypto";

type CreateUserData = {
    login: string,
    email: string,
    passwordHash: string
}

type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}
type PasswordRecovery = {
    recoveryCode: string | null;
    expirationDate: Date | null;
}

export class UserEntity {
    private constructor(
        public readonly login: string,
        public readonly email: string,
        public readonly passwordHash: string,
        public readonly createdAt: Date,
        public readonly emailConfirmation: EmailConfirmation,
        public readonly passwordRecovery: PasswordRecovery
    ) { }

    static createUser(data: CreateUserData) {
        const createdAt = new Date();
        const emailConfirmation: EmailConfirmation = {
            confirmationCode: randomUUID(),
            expirationDate: new Date(createdAt.getTime() + 90 * 60 * 1000),
            isConfirmed: false
        }
        const passwordRecovery: PasswordRecovery = {
            recoveryCode: null,
            expirationDate: null,
        }
        return new UserEntity(data.login.trim(), data.email.trim(), data.passwordHash, createdAt, emailConfirmation, passwordRecovery)
    }

    confirmEmail(code: string, now: Date = new Date()): boolean {
        const confirmation = this.emailConfirmation;
        if (confirmation.isConfirmed) {
            return false;
        }

        if (confirmation.confirmationCode !== code) {
            return false;
        }

        if (confirmation.expirationDate.getTime() < now.getTime()) {
            return false;
        }

        confirmation.isConfirmed = true;
        return true;
    }
}


