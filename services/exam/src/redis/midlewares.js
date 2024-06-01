const { json } = require('express')
const {redis} = require('./../redis/redis')
const cached = async (req,res,next)=>{
    const { id } = req.params
    // const cached = await redis.get(id)
    // console.log(` Cached Data : ${cached}`)

    const details = await redis.exists(`withOutQuestions : ${id}`)
    const questions = await redis.exists(`withQuestions : ${id}`)
    
    if(details){
        await redis.get(`withOutQuestions : ${id}`).then((result) => {
            if(result != null){
                const jresult = JSON.parse(result)
                console.log(` Cached Data : ${jresult}`); // Prints "value"
                res.status(200).json(jresult)
            }
            // else{
            //     next()
            // }
        })    
    }else if(questions){
        await redis.get(`withOutQuestions : ${id}`).then((result) => {
            if(result != null){
                const jresult = JSON.parse(result)
                console.log(` Cached Data : ${jresult}`); // Prints "value"
                res.status(200).json(jresult)
            }
            // else{
            //     next()
            // }
        })        
    }else{
        next()
    }




    
}

module.exports = {cached}