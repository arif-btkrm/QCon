const axios = require('axios')
const { QUESTION_SERVICE,CONTEST_SERVICE } = require('../config');

const getContest = async (contestId)=>{
    let contest
    try{
        await axios.get(`${CONTEST_SERVICE}/contests/${contestId}`)
          .then(function (response) {
            contest = response.data
        })
        .catch(function (error) {
            console.log(error);
        });
    }catch(err){
        console.log(err)
        // res.sendStatus(500)
    }
    return contest
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

const getSubmissions = async (contestid)=>{
    console.log("getSubmissions Called :")
    let submissions
    try{
        await axios.get(`${CONTEST_SERVICE}/submits/${contestid}`)
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

const calculateResult = async(contestdetails,questions,submissions)=>{
    console.log("Calculate Result Called :")
    let finalResults = []
    submissions.forEach(submit => {
        let Marks = 0 
        let sohwAns = []
        let correctAns = 0
        let wrongAns = 0
        let Status = ''
        const nagMark = contestdetails.negative_marks
        userId = submit.user_id
        contestid = submit.contest_id
        
        duration = getDuration(submit.submit_time, contestdetails.time,contestdetails.duration_munite) // miliSeconds
        
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
        if(Marks>=contestdetails.pass_marks){
            Status = "Pass"
        }else{
            Status = "Fail"
        }
        const result = { "contest_id": contestid,"rank": 0,"user_id": userId, "duration": duration, "marks": Marks, "correct_ans": correctAns, "wrong_ans": wrongAns, "status": Status, "submission": sohwAns} // Can include Submission time
        finalResults.push(result)
    });

    // finalResults.sort((a,b) => a.duration - b.duration) // Sorted By duration in descending
    finalResults.sort((a,b) => b.marks - a.marks) // Sorted By marks
    finalResults = addRank(finalResults) // included Rank Number
    // console.log(finalResults)
    
    return finalResults
}

const addRank = (finalResults)=>{
    finalResults.forEach((finalResult,index)=>{
        finalResult.rank = index+1
    })
    return finalResults
}

const objToValueString = (objs)=>{
    const sqlValues = objs.map(item => `(${item.contest_id}, '${item.rank}', '${item.user_id}','${item.duration}','${item.marks}','${item.correct_ans}','${item.wrong_ans}','${item.status}', '${item.submission}')`);
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

module.exports = {getContest,getQuestions,getSubmissions,calculateResult,objToValueString}