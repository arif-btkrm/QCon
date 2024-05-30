const pool = require('../db/db')
const axios = require('axios')

const { QUESTION_SERVICE,EXAM_SERVICE } = require('../config');
const { json } = require('express');


// submitTime.toLocaleTimeString('en-US', {  // Need to work with time to adjust timezone
//     timeZone: process.env.TZ
//   })

const getMyResult = async (req,res)=>{
    const id  = req.headers['x-user-id']
    try{
        const data = await pool.query(`SELECT * FROM question WHERE user_id= '${id}' LIMIT 1`)
        data = data.rows[0]
        res.status(200).send(data.rows)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

// --------------- Utilities ------------------

const getExam = async (examId)=>{
    let exam
    try{
        await axios.get(`${EXAM_SERVICE}/exams/${examId}`)
          .then(function (response) {
           exam = response.data
            // console.log(exam)
            // res.status(response.status).send(response.data);
        })
        .catch(function (error) {
            console.log(error);
            // res.status(error.response.status).send(error.response.data);
            
        });
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
    return exam
}

const getQuestions = async (qids)=>{
    let questions
    try{
        await axios.post(`${QUESTION_SERVICE}/questions`,{ids:qids})
          .then(function (response) {
            questions = response.data
            // console.log(questions)
            // res.status(response.status).send(response.data);
        })
        .catch(function (error) {
            console.log(error);
            // res.status(error.response.status).send(error.response.data);
            
        });
    }catch(err){
        console.log(err)
        // res.sendStatus(500)
    }
    return questions
}

const getSubmitions = async (examid)=>{
    let submitions
    try{
        await axios.get(`${EXAM_SERVICE}/submits/${examid}`,)
          .then(function (response) {
            submitions = response.data
            // console.log(submitions)
            // res.status(response.status).send(response.data);
        })
        .catch(function (error) {
            console.log(error);
            res.status(error.response.status).send(error.response.data);
            
        });
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
    return submitions
}

const calculateResult = async(examdetails,questions,submitions)=>{
    
    let finalResults = []
    submitions.forEach(submit => {
        let Marks = 0 
        let sohwAns = []
        let correctAns = 0
        let wrongAns = 0
        let Status = ''
        const nagMark = examdetails.nagetivemarks
        userId = submit.userid
        examid = submit.examid
        subTime = submit.submittime
        answers = JSON.parse(submit.answers)
        questions.forEach(question=>{
           const id = question.id
            if(question.ans == answers[id]){
                Marks++;
                correctAns++
            }else{
                // Marks = Marks - nagMark
                wrongAns++
            }
            question.your_ans = answers[id]
            sohwAns.push(question)
        })
        if(Marks>=examdetails.passmarks){
            Status = "Pass"
        }else{
            Status = "Fail"
        }
        const result = { "user_Id": userId, "exam_Id": examid, "submition": sohwAns, "correct_Ans": correctAns, "wrong_Ans": wrongAns, "masks": Marks, "status": Status}
        finalResults.push(result)
        // console.log(`Question ans :  ${question.ans}`)
        // console.log(`Submited Answer : ${answers[id]}`)
    });
    console.log(finalResults)
}

// --------------------------- Utility Part Ends ------------------
const makeResultByExamId = async (req,res)=>{
    const { examId } = req.body
    
    const examdetails = await getExam(examId)
    const qids = examdetails.questionids
    const questions = await getQuestions(qids)
    const submitions = await getSubmitions(examId)
    const recult =  await calculateResult(examdetails,questions,submitions)
    // console.log(examdetails)
    // // console.log(qids)
    // console.log(questions)
    // console.log(submitions)


      
};

const getResultByExamId = async (req,res)=>{
    const { examid } = req.params
    // console.log(id)
    try{
        let data = await pool.query(`SELECT * FROM result WHERE id IN (${examid})`)
        data = data.rows
        res.status(200).json(data)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

module.exports = {makeResultByExamId,getResultByExamId,getMyResult};