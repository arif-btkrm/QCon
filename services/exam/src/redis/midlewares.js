const { json } = require('express')
const {redis} = require('./../redis/redis')
const cached = async (req,res,next)=>{
    const { id } = req.params
    // const cached = await redis.get(id)
    // console.log(` Cached Data : ${cached}`)
    await redis.get(`"${id}"`).then((result) => {
        console.log(` Cached Data : ${result}`); // Prints "value"
        if(result != null){
            const jresult = JSON.parse(result)
            res.status(200).json(jresult)
        }
        else{
            next()
        }
      })

    
}

module.exports = {cached}