export default {
  mongo_url: process.env.MONGO_URL || "mongodb://localhost/beers",
  mail_host: process.env.MAIL_HOST,
  mail_port: Number(process.env.MAIL_PORT),
  mail_user: process.env.MAIL_USER,
  mail_pass: process.env.MAIL_PASS
}