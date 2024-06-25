const nodeMailer = require('nodemailer')

const {MAIL_SERVICE,SMTP_HOST,SMTP_PORT,DEFAULT_EMAIL_SENDER} = require('./config')

const transporter =  nodeMailer.createTransport({
    host: SMTP_HOST,
    port:SMTP_PORT
})

const mail = async (mailData) =>{
    // console.log(mailData)
    const mailTo = mailData.to
    const mailBody = mailData.body
    const mailSubject = "contest-result"
    const mailFrom = DEFAULT_EMAIL_SENDER
    
    const info = transporter.sendMail({
        from: mailFrom,
        to: mailTo,
        subject: mailSubject,
        body: mailBody
    })
    console.log("Message sent : "+info.to)
}

module.exports = {mail}