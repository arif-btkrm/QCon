const pool = require('./../db/db')
const {redis} = require('./../redis/redis')
const {getQuestionOnlyByIds} = require('./utils')


const addExam = async (req,res)=>{ // need to choose time format for storing in db
    const added_by  = req.headers['x-user-id']
    const {name, duration_munite, total_marks,pass_marks, negative_marks, questions_ids, class_id, course_id} = req.body 
    // const time2 = new Date(req.body.time) // Working
    // console.log(`Time from new Date ${time2}`)
    const time = new Date(req.body.time).toISOString() // working
    console.log(` Time of To String${time}`)
    // console.log(req.body);
    try{
        await pool.query('INSERT INTO exam (name, time, duration_munite, total_marks, pass_marks, negative_marks, questions_ids, class_id,course_id, added_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10)', [name, time, duration_munite, total_marks,pass_marks, negative_marks, questions_ids,class_id,course_id,added_by] )
        res.status(201).send( {message: `create Exam Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const addSubmit = async (req,res)=>{ // need to do later
    // const user_id  = req.headers['x-user-id']
    const {examId, userId, answers} = req.body // user id should get from headers
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
const addSubmitByMessage = async (data)=>{ // Need to implement Later
        // console.log(` Sebmited message data : ${JSON.parse(data)}`)
        // console.log(` Sebmited message Count data : ${data.messageCount}`)

    const { examId, userId, submitTime, answers} = data
//    console.log(answers);
   
   try{
       await pool.query('INSERT INTO submit (  exam_id, user_id, submit_time, answers) VALUES ($1, $2, $3, $4)', [ examId, userId, submitTime, answers] )
        console.log("Submit by message Successful")
   }catch(err){
       console.log(err)
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
        let examTime = data.time
        console.log(`Exam Time : ${examTime}`)
        examTime = parseInt(examTime.getTime()/1000) // in Seconds
        let now = new Date()
        console.log(`Now Time : ${now}`)
        now = parseInt(now.getTime()/1000)  // in Seconds

        const examEnd =  examTime + (data.duration_munite*60)  // in Seconds
        // console.log(`Exam End: ${new Date(examEnd*1000)}`)
        if(now < examTime){
            delete data.questions_ids
            
            const sdata = JSON.stringify(data)
            const ExpTime = examTime-now // In Seconds
           // console.log(ExpTime)
            redis.setex(`withOutQuestions:${id}`,ExpTime,sdata)
            res.status(200).json(data)
            
        }else if(now > examTime && now < examEnd){
            // redis.set(`running_contest_id:${id}`,"running...")
            // redis.expireat(`running_contest_id:${id}`,examEnd)
            console.log('Contest is running')
            const ExpTime = examEnd-now // In Seconds
            redis.setex(`running_contest_id:${id}`,ExpTime,"running...")
            const qids = data.questions_ids
            const qstns = await getQuestionOnlyByIds(qids)
            data.questions = qstns
            const sqdata = JSON.stringify(data)
            // console.log(`Value of sqdata : ${sqdata}`)
            redis.setex(`withQuestions:${id}`,ExpTime,sqdata)
            
            res.status(200).json(data)
            
        }
        else{
            const qids = data.questions_ids
            const qstns = await getQuestionOnlyByIds(qids)
            data.questions = qstns            
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
    // console.log(examid)
    try{
        let data = await pool.query(`SELECT * FROM submit WHERE exam_id = '${examid}'`)
        res.status(200).json(data.rows)
        // return data.rows

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

module.exports = {addExam,getExams,getExamById,addSubmit,getSubmitsByExamId,addSubmitByMessage};