import nodemailer from "nodemailer";
import nodemailerConfig from "../nodemailer/config";

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
