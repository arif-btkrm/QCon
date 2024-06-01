const pool = require('./../db/db')
const {redis} = require('./../redis/redis')
const {getQuestionOnlyByIds} = require('./utils')


const addExam = async (req,res)=>{
    const addedBy  = req.headers['x-user-id']
    const {name, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,classId,courseId} = req.body 
    const time = new Date(req.body.time).toISOString()
    // console.log(req.body);
    try{
        await pool.query('INSERT INTO exam (name, time, duration_munite, total_marks, pass_marks, negative_marks, questions, class_id,course_id, added_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10)', [name, time, durationMunite, totalMarks,passMarks, nagetiveMarks, questionIds,classId,courseId,addedBy] )
        res.status(201).send( {message: ` create Exam Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const addSubmit = async (req,res)=>{ // need to do later
    const {examId, userId, answers} = req.body
    const submitTime = new Date();
    console.log(req.body);
    
    try{
        await pool.query('INSERT INTO submit ( exam_id, user_id, submit_time, answers) VALUES ($1, $2, $3, $4)', [ examId, userId, submitTime, answers] )
        res.status(201).send( {message: ` Submission Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};
const addSubmitByMessage = async (data)=>{
    const { examId, userId, submitTime, answers} = data
   console.log(answers);
   
   try{
       await pool.query('INSERT INTO submit (  exam_id, user_id, submit_time, answers) VALUES ($1, $2, $3, $4)', [ examId, userId, submitTime, answers] )
    //    res.status(201).send( {message: ` Submission Successful`})

   }catch(err){
       console.log(err)
    //    res.sendStatus(500)
   }   
};

const getExams = async (req,res)=>{
    const id  = req.headers['x-user-id']
    try{
        const data = await pool.query(`SELECT id,name,time,duration_munite,total_marks,pass_marks,negative_marks,class_id,course_id,added_by FROM exam`)
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
        const examTime = new Date(data.time).getTime()
        const now = new Date().getTime()
        const duration_munite = data.duration_munite

        if(now < examTime){
            delete data.questions
            res.status(200).json(data)

            const sdata = JSON.stringify(data)
            const ExpTime = (examTime-now)/1000 // In Seconds
            redis.setex(`withOutQuestions : ${id}`,ExpTime,sdata)

        }else{
            const qids = data.questions
            const qstns = await getQuestionOnlyByIds(qids)
            data.questions = qstns
            
            const sdata = JSON.stringify(data)
            const ExpTime = 60*duration_munite // In Seconds
            redis.setex(`withQuestions : ${id}`,ExpTime*60,sdata)
            
            res.status(200).json(data)
            
        }
        
        // const sdata = JSON.stringify(data)
        // const ExpTime = 10 // 10 Seconds
        // redis.setex(`"${id}"`,ExpTime,sdata)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getSubmitsByExamId = async (req,res)=>{ // internally call by result service
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