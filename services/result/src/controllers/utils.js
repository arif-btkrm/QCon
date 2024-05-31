const axios = require('axios')
const { QUESTION_SERVICE,EXAM_SERVICE } = require('../config');



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

const getSubmissions = async (examid)=>{
    let submissions
    try{
        await axios.get(`${EXAM_SERVICE}/submits/${examid}`,)
          .then(function (response) {
            submissions = response.data
            // console.log(submissions)
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
    return submissions
}

const calculateResult = async(examdetails,questions,submissions)=>{
    
    let finalResults = []
    submissions.forEach(submit => {
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
                question.your_ans = answers[id]
                sohwAns.push(JSON.stringify(question))
            }else if(answers[id]>=1 && answers[id]<=4){
                Marks = Marks - nagMark
                wrongAns++
                question.your_ans = answers[id]
                sohwAns.push(JSON.stringify(question))
            }
            
        })
        if(Marks>=examdetails.passmarks){
            Status = "Pass"
        }else{
            Status = "Fail"
        }
        const result = { "exam_id": examid,"rank": 0,"user_id": userId, "submit_time": subTime, "marks": Marks, "correct_ans": correctAns, "wrong_ans": wrongAns, "status": Status, "submission": sohwAns} // Can include Submission time
        finalResults.push(result)
        // console.log(`Question ans :  ${question.ans}`)
        // console.log(`Submited Answer : ${answers[id]}`)
    });
    finalResults.sort((a,b) => a.submit_time - b.submit_time) // Sorted By submit_time
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
    const sqlValues = objs.map(item => `(${item.exam_id}, '${item.rank}', '${item.user_id}','${item.submit_time}','${item.marks}','${item.correct_ans}','${item.wrong_ans}','${item.status}', '${item.submission}')`);
    return sqlValues
}

module.exports = {getExam,getQuestions,getSubmissions,calculateResult,objToValueString}