const {redis} = require('./redis')


const cached = async (req,res,next)=>{
    const { id } = req.params
    // const cached = await redis.get(id)
    // console.log(` Cached Data : ${cached}`)

    const details = await redis.exists(`waiting_for_contest:${id}`)
    const questions = await redis.exists(`withQuestions:${id}`)
    console.log(`Details : ${details}`)
    console.log(`Questions : ${questions}`)
    
    if(details){
        await redis.get(`waiting_for_contest:${id}`).then((result) => {
            if(result != null){
                const jresult = JSON.parse(result)
                console.log(`Contest Data From Cache : ${jresult}`); // Prints "value"
                res.status(200).json(jresult)
            }
            else{
                next()
            }
        })    
    }else if(questions){
        await redis.get(`withQuestions:${id}`).then((result) => { 
            // console.log(result) 
            if(result != null){
                const jresult = JSON.parse(result)
                console.log(`Question Data From Cache : ${jresult}`); // Prints "value"
                res.status(200).json(jresult)
            }
            else{
                next()
            }
        })        
    }else{
        next()
    }
    
}


module.exports = {cached}