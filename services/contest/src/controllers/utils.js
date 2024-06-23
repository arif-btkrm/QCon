const axios = require('axios')
const { QUESTION_SERVICE } = require('../config');

const getQuestionOnlyByIds = async (qids)=>{
        let questions
    try{
        await axios.post(`${QUESTION_SERVICE}/questions-only`,{ids:qids})
          .then(function (response) {
                questions = response.data
        })
        .catch(function (error) {
            console.log(error)
        });
    }catch(err){
        console.log(err)
    }
    // console.log(questions)

    return questions
}

module.exports = {getQuestionOnlyByIds}