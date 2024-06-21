const {mail} = require('./../mail')

const sendResultByMail = async (req,res)=>{
    try{
        const mailData = req.mailData
        await mail(mailData).catch(e => console.log(e))
        res.status(200).send({message: "Mail Sent Success!!!"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

module.exports = {sendResultByMail}