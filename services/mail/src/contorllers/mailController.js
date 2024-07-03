const {mail} = require('./../mail')

const {getContest,getUsersByIds,getResultsByContestId} = require('./utils')

const sendResultByMail = async (req,res)=>{
    try{
        const mailData = req.body.mailData  // mailData should be the array of objects
        // console.log(mailData)
        await mail(mailData).catch(e => console.log(e))
        res.status(200).send({message: "Mail Sent Success!!!"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

const sendResultMailByMsg = async (mailData)=>{
    try{
        // const mailData = mailData  // mailData should be the array of objects
        await mail(mailData).catch(e => console.log(e))
        // res.status(200).send({message: "Mail Sent Success!!!"})
        console.log("Mail Sent Success!!!")
    }catch(err){
        console.log(err)
        // res.sendStatus(500)
    }
}

const processTheMailBody = async (contest_id)=>{
    console.log('Hi from Process Mail Body')
    // console.log(contest_id)
    // const contest_id = 1
    // get contest data with contest id
    const contestdetails = await getContest(contest_id)
    // console.log(`Contest Details : ${contestdetails}`)
    // console.log(contestdetails)


    // get result data with and get the user_id
    const Allresults = await getResultsByContestId(contest_id)
    // console.log(`All Results : ${Allresults}`)
    // console.log(Allresults)

    const user_ids = Allresults.map(result => result.user_id);
    // console.log("User Ids : ")
    // console.log(user_ids)
    // get email from user with user id
    const users = await getUsersByIds(user_ids)
    // console.log(`Users : ${users}`)
    // console.log(users)

    // const resultsToMail = Allresults.map((result)=>{
    //     const temp = {
    //         Name : contestdetails.name,
    //         Time : contestdetails.time,
    //         Duration : contestdetails.duration_munite,
    //         Total : contestdetails.total_marks,
    //         PassMark : contestdetails.pass_marks,
    //         NegativeMark : contestdetails.negative_marks,
    //         UserName : users.name,
    //         UserEmail : users.email,
    //         Rank : result.rank,
    //         Marks : result.marks,
    //     }
    //     console.log(result) // rest/spread operation
    // })
    const mailData = {
        "to" : "habijabi@qcon.com",
        "body" : "Mail Body"
    }
    sendResultMailByMsg (mailData)
}

module.exports = {sendResultByMail,processTheMailBody}