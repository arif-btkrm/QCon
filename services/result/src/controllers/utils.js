// --------------- Utilities ------------------

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
            }else{
                // Marks = Marks - nagMark
                wrongAns++
            }
            question.your_ans = answers[id]
            sohwAns.push(question)
        })
        if(Marks>=examdetails.passmarks){
            Status = "Pass"
        }else{
            Status = "Fail"
        }
        const result = { "user_Id": userId, "exam_Id": examid, "submission": sohwAns, "correct_Ans": correctAns, "wrong_Ans": wrongAns, "masks": Marks, "status": Status} // Can include Submission time
        finalResults.push(result)
        // console.log(`Question ans :  ${question.ans}`)
        // console.log(`Submited Answer : ${answers[id]}`)
    });
    return finalResults
    console.log(finalResults)
}

module.exports = {getExam,getQuestions,getSubmissions,calculateResult}