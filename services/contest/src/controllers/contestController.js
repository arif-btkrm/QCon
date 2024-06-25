const pool = require('./../db/db')
const {redis} = require('./../redis/redis')
const {getQuestionOnlyByIds} = require('./utils')


const addContest = async (req,res)=>{ // need to choose time format for storing in db
    const added_by  = req.headers['x-user-id']
    const {name, duration_munite, total_marks,pass_marks, negative_marks, questions_ids, class_id, course_id} = req.body
    const time = new Date(req.body.time).toISOString() // working
    // console.log(` Time of To String${time}`)
    // console.log(req.body);
    try{
        await pool.query('INSERT INTO contest (name, time, duration_munite, total_marks, pass_marks, negative_marks, questions_ids, class_id,course_id, added_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10)', [name, time, duration_munite, total_marks,pass_marks, negative_marks, questions_ids,class_id,course_id,added_by] )
        res.status(201).send( {message: `create Contest Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const addSubmit = async (req,res)=>{ // need to do later
    // const user_id  = req.headers['x-user-id']
    const {contestId, userId, answers} = req.body // user id should get from headers
    const submitTime = new Date();
    // console.log(req.body);
    
    try{
        await pool.query('INSERT INTO submit ( contest_id, user_id, submit_time, answers) VALUES ($1, $2, $3, $4)', [ contestId, userId, submitTime, answers] )
        res.status(201).send( {message: ` Submission Successful`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};
const addSubmitByMessage = async (data)=>{ // Need to implement Later
        // console.log(` Sebmited message data : ${JSON.parse(data)}`)
        // console.log(` Sebmited message Count data : ${data.messageCount}`)

    const { contestId, userId, submitTime, answers} = data
//    console.log(answers);
   
   try{
       await pool.query('INSERT INTO submit (  contest_id, user_id, submit_time, answers) VALUES ($1, $2, $3, $4)', [ contestId, userId, submitTime, answers] )
        console.log("Submit by message Successful")
   }catch(err){
       console.log(err)
   }   
};

const getContests = async (req,res)=>{
    const id  = req.headers['x-user-id']
    try{
        const data = await pool.query(`SELECT id,name,time,duration_munite,total_marks,pass_marks,negative_marks,class_id,course_id,added_by FROM contest`)
        res.status(200).send(data.rows)

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getContestById = async (req,res)=>{
    const { id } = req.params
    // console.log(id)
    try{
        let data = await pool.query(`SELECT * FROM contest WHERE id= '${id}' LIMIT 1`) // Need ro fix contest time issue
        data = data.rows[0]
        let contestTime = data.time
        // console.log(`Contest Time : ${contestTime}`)
        contestTime = parseInt(contestTime.getTime()/1000) // in Seconds
        let now = new Date()
        // console.log(`Now Time : ${now}`)
        now = parseInt(now.getTime()/1000)  // in Seconds

        const contestEnd =  contestTime + (data.duration_munite*60)  // in Seconds
        // console.log(`Contest End: ${new Date(contestEnd*1000)}`)
        if(now < contestTime){
            delete data.questions_ids
            
            const sdata = JSON.stringify(data)
            const ExpTime = contestTime-now // In Seconds
           // console.log(ExpTime)
            redis.setex(`waiting_for_contest:${id}`,ExpTime,sdata)
            res.status(200).json(data)
            
        }else if(now > contestTime && now < contestEnd){
            const ExpTime = contestEnd-now // In Seconds
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

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const getSubmitsByContestId = async (req,res)=>{ // internally call by result service
    const { contestid } = req.params
    // console.log(contestid)
    try{
        let data = await pool.query(`SELECT * FROM submit WHERE contest_id = '${contestid}'`)
        res.status(200).json(data.rows)
        // return data.rows

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
};

const deleteSubmitsByMessage = async (contestid)=>{ // internally call by result service
    try{
        let data = await pool.query(`DELETE FROM submit WHERE contest_id = '${contestid}'`)
        console.log(`All Submissions Deleted for Contest : ${contestid}`)
    }catch(err){
        console.log(err)
        // res.sendStatus(500)
    }   
};

module.exports = {addContest,getContests,getContestById,addSubmit,getSubmitsByContestId,addSubmitByMessage,deleteSubmitsByMessage};