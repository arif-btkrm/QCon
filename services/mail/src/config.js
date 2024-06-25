const MAIL_SERVICE =	process.env.MAIL_SERVICE_URL || 'http://host.docker.internal:4007';
const SMTP_HOST =	process.env.SMTP_HOST || 'http://host.docker.internal';
const SMTP_PORT = process.env.SMTP_PORT || '1025';
const DEFAULT_EMAIL_SENDER = process.env.DEFAULT_EMAIL_SENDER || "result@qcon.com"

const USER_SERVICE = process.env.USER_SERVICE_URL
const CONTEST_SERVICE = process.env.CONTEST_SERVICE_URL
const RESULT_SERVICE = process.env.RESULT_SERVICE_URL

module.exports = {MAIL_SERVICE,SMTP_HOST,SMTP_PORT,DEFAULT_EMAIL_SENDER,USER_SERVICE,CONTEST_SERVICE,RESULT_SERVICE}
