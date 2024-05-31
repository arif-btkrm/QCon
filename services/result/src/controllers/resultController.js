const pool = require('../db/db')
const axios = require('axios')

const { QUESTION_SERVICE,EXAM_SERVICE } = require('../config');
const { json } = require('express');

const {getExam,getQuestions,getSubmissions,calculateResult} = require('./utils')

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


const makeResultByExamId = async (req,res)=>{
    const { examId } = req.body
    
    const examdetails = await getExam(examId)
    const qids = examdetails.questionids
    const questions = await getQuestions(qids)
    const submissions = await getSubmissions(examId)
    const results =  await calculateResult(examdetails,questions,submissions)
    
    // Push to Database


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