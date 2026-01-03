import nodemailer from 'nodemailer';
import { SETTINGS } from '../../core/settings/settings';

function normalizeAppPassword(s?: string) {
  return (s ?? '').replace(/\s+/g, ''); // убираем пробелы из 16-значного app password
}

export const nodemailerService = {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL,
        pass: normalizeAppPassword(SETTINGS.EMAIL_PASS), // app password (16 chars)
      },
    });

    let info = await transporter.sendMail({
      from: '"Kek 👻" <codeSender>',
      to: email,
      subject: 'Your code is here',
      html: template(code),
    });

    return !!info;
  },
};
