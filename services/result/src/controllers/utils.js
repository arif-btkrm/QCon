const axios = require('axios')
const { QUESTION_SERVICE,EXAM_SERVICE } = require('../config');

const getExam = async (examId)=>{
    let exam
    try{
        await axios.get(`${EXAM_SERVICE}/exams/${examId}`)
          .then(function (response) {
           exam = response.data
        })
        .catch(function (error) {
            console.log(error);
        });
    }catch(err){
        console.log(err)
        // res.sendStatus(500)
    }
    return exam
}

const getQuestions = async (qids)=>{
    console.log("getQuestion Called")
    let questions
    try{
        await axios.post(`${QUESTION_SERVICE}/questions-ans`,{ids:qids})
          .then(function (response) {
            questions = response.data
        })
        .catch(function (error) {
            console.log(error);            
        });
    }catch(err){
        console.log(err)
    }
    return questions
}

const getSubmissions = async (examid)=>{
    console.log("getSubmissions Called :")
    let submissions
    try{
        await axios.get(`${EXAM_SERVICE}/submits/${examid}`)
          .then(function (response) {
            // console.log(response)
            submissions = response.data
        })
        .catch(function (error) {
            console.log(error);
            // res.status(error.response.status).send(error.response.data); 
        });
    }catch(err){
        console.log(err)
        // res.sendStatus(500)
    }
    return submissions
}

const calculateResult = async(examdetails,questions,submissions)=>{
    console.log("Calculate Result Called :")
    let finalResults = []
    submissions.forEach(submit => {
        let Marks = 0 
        let sohwAns = []
        let correctAns = 0
        let wrongAns = 0
        let Status = ''
        const nagMark = examdetails.negative_marks
        userId = submit.user_id
        examid = submit.exam_id
        
        duration = getDuration(submit.submit_time, examdetails.time,examdetails.duration_munite) // miliSeconds
        
        answers = JSON.parse(submit.answers)
        questions.forEach(question=>{
           const id = question.id
            if(question.correct_ans == answers[id]){
                Marks++;
                correctAns++
                question.your_ans = answers[id]
                sohwAns.push(JSON.stringify(question))
            }else if(answers[id]>=1 && answers[id]<=4){
                Marks = Marks - nagMark
                wrongAns++
                question.your_ans = answers[id]
                sohwAns.push(JSON.stringify(question))
            }
            
        })
        if(Marks>=examdetails.pass_marks){
            Status = "Pass"
        }else{
            Status = "Fail"
        }
        const result = { "exam_id": examid,"rank": 0,"user_id": userId, "duration": duration, "marks": Marks, "correct_ans": correctAns, "wrong_ans": wrongAns, "status": Status, "submission": sohwAns} // Can include Submission time
        finalResults.push(result)
    });

    // finalResults.sort((a,b) => a.duration - b.duration) // Sorted By duration in descending
    finalResults.sort((a,b) => b.marks - a.marks) // Sorted By marks
    finalResults = addRank(finalResults) // included Rank Number
    console.log(finalResults)
    
    return finalResults
}

const addRank = (finalResults)=>{
    finalResults.forEach((finalResult,index)=>{
        finalResult.rank = index+1
    })
    return finalResults
}

const objToValueString = (objs)=>{
    const sqlValues = objs.map(item => `(${item.exam_id}, '${item.rank}', '${item.user_id}','${item.duration}','${item.marks}','${item.correct_ans}','${item.wrong_ans}','${item.status}', '${item.submission}')`);
    return sqlValues
}
const getDuration = (submittime, time, maxDuration)=>{
    duration = new Date(submittime) - new Date(time) // miliseconds
    maxDuration = maxDuration*60*1000; // miliseconds
    
    duration = (duration<maxDuration)? duration : maxDuration
    
    const DurTime = new Date(duration);
    
    const seconds = DurTime.getSeconds()
    const munits = DurTime.getMinutes()

    const secondsString = (seconds < 10)? `0${seconds}`: `${seconds}`
    const munitsString = (munits < 10)? `0${munits}`: `${munits}`
    
    const durationString = `${munitsString} : ${secondsString}`  
    
    return durationString
}

module.exports = {getExam,getQuestions,getSubmissions,calculateResult,objToValueString}