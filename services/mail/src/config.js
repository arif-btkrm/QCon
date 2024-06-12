const MAIL_SERVICE =	process.env.MAIL_SERVICE_URL || 'http://host.docker.internal:4007';
const SMTP_HOST =	process.env.SMTP_HOST || 'http://host.docker.internal';
const SMTP_PORT = process.env.SMTP_PORT || '1025';
const DEFAULT_EMAIL_SENDER = process.env.DEFAULT_EMAIL_SENDER || "result@qcon.com"
module.exports = {MAIL_SERVICE,SMTP_HOST,SMTP_PORT,DEFAULT_EMAIL_SENDER}
