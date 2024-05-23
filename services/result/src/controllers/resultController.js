const pool = require('../db/db')
const axios = require('axios')

const { AUTH_SERVICE } = require('../config');


const addQuestion = async (req,res)=>{
    const {question, option1, option2, option3, option4, ans, classId, courseId} = req.body
    // console.log(req.body);
    
    try{
        await pool.query('INSERT INTO question (question, option1, option2, option3, option4, ans, classId, courseId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [question, option1, option2, option3, option4, ans, classId, courseId])
        res.status(201).send( {message: ` create Exam Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

;

const getQuestion = async (req,res)=>{
    const id  = req.headers['x-user-id']
    try{
        const data = await pool.query(`SELECT * FROM question`)
        res.status(200).send(data.rows)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getQuestionById = async (req,res)=>{
    const { id } = req.params
    // console.log(id)
    try{
        let data = await pool.query(`SELECT * FROM question WHERE id= '${id}' LIMIT 1`)
        data = data.rows[0]
        res.status(200).json(data)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getQuestionsByIds = async (req,res)=>{
    const { ids } = req.body
    // console.log(id)
    try{
        let data = await pool.query(`SELECT * FROM question WHERE id IN (${ids})`)
        data = data.rows
        res.status(200).json(data)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

module.exports = {getQuestion,addQuestion,getQuestionById,getQuestionsByIds};