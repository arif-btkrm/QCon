const pool = require('./../db/db')


const addExam = async (req,res)=>{
    const {name, time, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,createdBy} = req.body
    console.log(req.body);
    
    try{
        await pool.query('INSERT INTO exam (Name, time, durationMunite, totalMarks, passMarks, nagetiveMarks, questionIds, classId,courseId, createdBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, time, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,createdBy] )
        res.status(201).send( {message: ` create Exam Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const addSubmit = async (req,res)=>{
    // const {name, time, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,createdBy} = req.body
    // console.log(req.body);
    
    // try{
    //     await pool.query('INSERT INTO exam (Name, time, durationMunite, totalMarks, passMarks, nagetiveMarks, questionIds, classId,courseId, createdBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, time, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,createdBy] )
    //     res.status(201).send( {message: ` create Exam Successful`})

    // }catch(err){
    //     console.log(err)
    //     res.sendStatus(500)
    // }   
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
        res.status(200).json(data)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};



module.exports = {addExam,getExams,getExamById,addSubmit};