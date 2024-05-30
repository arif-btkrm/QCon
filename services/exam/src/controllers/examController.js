const pool = require('./../db/db')
const {redis} = require('./../redis/redis')

const addExam = async (req,res)=>{
    const createdBy  = req.headers['x-user-id']
    const {name, time, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,classId,courseId} = req.body
    console.log(req.body);
    
    try{
        await pool.query('INSERT INTO exam (Name, time, durationMunite, totalMarks, passMarks, nagetiveMarks, questionIds, classId,courseId, createdBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10)', [name, time, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,classId,courseId,createdBy] )
        res.status(201).send( {message: ` create Exam Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const addSubmit = async (req,res)=>{ // need to do later
     const {examId, answers} = req.body
     const userId = 4
     const submitTime = new Date();
    console.log(req.body);
    
    try{
        await pool.query('INSERT INTO submit ( userId, examId, submitTime, answers) VALUES ($1, $2, $3, $4)', [userId, examId, submitTime, answers] )
        res.status(201).send( {message: ` Submission Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};
const addSubmitByMessage = async (data)=>{
    const {userId, examId, submitTime, answers} = data
   console.log(answers);
   
   try{
       await pool.query('INSERT INTO submit ( userId, examId, submitTime, answers) VALUES ($1, $2, $3, $4)', [userId, examId, submitTime, answers] )
    //    res.status(201).send( {message: ` Submission Successful`})

   }catch(err){
       console.log(err)
    //    res.sendStatus(500)
   }   
};

const getExams = async (req,res)=>{
    const id  = req.headers['x-user-id']
    try{
        const data = await pool.query(`SELECT * FROM exam`)
        res.status(200).send(data.rows)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getExamById = async (req,res)=>{
    const { id } = req.params
    // console.log(id)
    try{
        let data = await pool.query(`SELECT * FROM exam WHERE id= '${id}' LIMIT 1`)
        data = data.rows[0]
        const sdata = JSON.stringify(data)
        const ExpTime = 10 // 10 Seconds
        redis.setex(`"${id}"`,ExpTime,sdata)
        res.status(200).json(data)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getSubmitsByExamId = async (req,res)=>{
    const { examid } = req.params
    // console.log(id)
    try{
        let data = await pool.query(`SELECT * FROM submit WHERE examid = '${examid}'`)
        res.status(200).json(data.rows)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

module.exports = {addExam,getExams,getExamById,addSubmit,getSubmitsByExamId,addSubmitByMessage};