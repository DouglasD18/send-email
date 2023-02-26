import nodemailer from "nodemailer";
import env from "../../main/config/env";

const nodemailerConfig = {
  host: env.mail_host,
  port: env.mail_port,
  auth: {
    user: env.mail_user,
    pass: env.mail_pass
  }
}

const mail = nodemailer.createTransport(nodemailerConfig);

export default {
  key: "SendEmail", 
  async handle({ user }) {
    const { name, email } = user;

    await mail.sendMail({
      from: 'Queue Test <queue@mail.com.br>',
      to: `${name} <${email}>`,
      subject: "Account created",
      html: `Hy, ${name}, your account has been created!`
    });
  }
}
