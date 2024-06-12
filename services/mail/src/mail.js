const nodeMailer = require('nodemailer')

const {MAIL_SERVICE,SMTP_HOST,SMTP_PORT,DEFAULT_EMAIL_SENDER} = require('./config')


const mail = async (mailData) =>{

    const mailTo = mailData.to
    const mailBody = mailData.body

    const transporter = nodeMailer.createTransport({
        host: SMTP_HOST,
        port:SMTP_PORT
    })

    const info = await transporter.sendMail({
        from: DEFAULT_EMAIL_SENDER,
        to: mailTo,
        subject:"contest-result",
        body:mailBody
    })
    console.log("Message sent : "+info.messageId)
}

module.exports = {mail}