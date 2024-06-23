const {mail} = require('./../mail')

const sendResultByMail = async (req,res)=>{
    try{
        const mailData = req.mailData  // mailData should be the array of objects
        await mail(mailData).catch(e => console.log(e))
        res.status(200).send({message: "Mail Sent Success!!!"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

const processTheMailBody = async (req,res)=>{
    console.log('Hi from Process Mail Body')
}

module.exports = {sendResultByMail,processTheMailBody}