const nodeMailer = require('nodemailer')

const {MAIL_SERVICE,SMTP_HOST,SMTP_PORT,DEFAULT_EMAIL_SENDER} = require('./config')

const transporter =  nodeMailer.createTransport({
    host: SMTP_HOST,
    // host : 'localhost',
    port:SMTP_PORT,
    secure: false,
    logger: true, // Enable logging
    debug: true, // Enable debug output
})

const mail = async (mailData) =>{
    // console.log(mailData)
    const mailTo = mailData.to
    const mailBody = mailData.body
    const mailSubject = "contest-result"
    const mailFrom = DEFAULT_EMAIL_SENDER
    
    const mailOptions = {
        from: mailFrom,
        to: mailTo,
        subject: mailSubject,
        text: mailBody
    }

    // const info = transporter.sendMail(mailOptions)
    // console.log("Message sent : "+info.to)

   transporter.sendMail(mailOptions)
  .then(info => {
    console.log('Message sent: %s', info.messageId);
  })
  .catch(error => {
    console.error('Error sending email:', error);
  });
}

module.exports = {mail}