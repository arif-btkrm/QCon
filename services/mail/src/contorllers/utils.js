const axios = require('axios')
const { USER_SERVICE,CONTEST_SERVICE,RESULT_SERVICE } = require('../config');

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

const getUsersByIds = async (uids)=>{
    console.log("getUsers Data Called")
    uids = uids.toString() // array to String
    let users
    try{
        await axios.post(`${USER_SERVICE}/getusers-ids`,{ids:uids})
          .then(function (response) {
            users = response.data
        })
        .catch(function (error) {
            console.log(error);            
        });
    }catch(err){
        console.log(err)
    }
    return users
}

const getResultsByContestId = async (contestid)=>{
    let results
    try{
        await axios.get(`${RESULT_SERVICE}/results/${contestid}`)
          .then(function (response) {
            // console.log(response)
            results = response.data
        })
        .catch(function (error) {
            console.log(error);
            // res.status(error.response.status).send(error.response.data); 
        });
    }catch(err){
        console.log(err)
        // res.sendStatus(500)
    }
    return results
}


module.exports = {getContest,getUsersByIds,getResultsByContestId}