const pool = require('../db/db')

const {getContest,getQuestions,getSubmissions,calculateResult,objToValueString} = require('./utils')
const {sendToQueue} = require('./../sendQueue')
// submitTime.toLocaleTimeString('en-US', {  // Need to work with time to adjust timezone
//     timeZone: process.env.TZ
//   })

const getMyResult = async (req,res)=>{
    const id  = req.headers['x-user-id']
    try{
        const data = await pool.query(`SELECT * FROM result WHERE user_id= '${id}' LIMIT 1`)
        data = data.rows[0]
        res.status(200).send(data.rows)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};


const makeResultByContestId = async (req,res)=>{
    const { contestId } = req.body
    const contestdetails = await getContest(contestId)
    const qids = contestdetails.questionids
    const questions = await getQuestions(qids)
    const submissions = await getSubmissions(contestId)
    const results =  await calculateResult(contestdetails,questions,submissions)
    
    // console.log(contestdetails)
    // // console.log(qids)
    // console.log(questions)
    // console.log(submitions)

    const sqlValues = objToValueString(results)
    // console.log(sqlValues)
    try{
        await pool.query(`INSERT INTO result (contest_id, rank, user_id, submit_time, marks, correct_ans, wrong_ans, status, submission) VALUES ${sqlValues.join(', ')}`)
        res.status(201).json({Message : "Success"})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
      
};

const makeResultByContestIdEvent = async (id)=>{        // Called from event expired
    console.log("makeResultByContestIdEvent Called")
    const contestId  = id
    try{
        const contestdetails = await getContest(contestId)
        const qids = contestdetails.questions_ids // need to handle if contestdetails is empty or not
        const questions = await getQuestions(qids)
        const submissions = await getSubmissions(contestId)
        const results =  await calculateResult(contestdetails,questions,submissions)
        
        const sqlValues = objToValueString(results)
   
   
        await pool.query(`INSERT INTO result (contest_id, rank, user_id, duration, marks, correct_ans, wrong_ans, status, submission) VALUES ${sqlValues.join(', ')}`)
        console.log("Insertion Result Successful")
        
        const msg = `result done id:${contestId}`
        sendToQueue('result', msg) // message to delete submissions for this id
        console.log("Result send to queue: ")
        
        // send a message to mail servise to send email of students mail
        sendToQueue('mailResult', msg) // message to send own result to their own email

    }catch(err){
        console.log("Result Operation Failed")
        console.log(err)
    }
      
};

const getResultsByContestId = async (req,res)=>{
    const { contestid } = req.params
    const role  = req.headers['x-user-role']
    console.log(role)
    try{
        let data = await pool.query(`SELECT * FROM result WHERE id IN (${contestid})`)
        data = data.rows
        res.status(200).json(data)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};



module.exports = {makeResultByContestId,getResultsByContestId,getMyResult,makeResultByContestIdEvent};