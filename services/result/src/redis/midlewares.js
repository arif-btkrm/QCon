const {redis} = require('./redis')


const cached = async (req,res,next)=>{
    // const { id } = req.params
    // // const cached = await redis.get(id)
    // // console.log(` Cached Data : ${cached}`)

    // const details = await redis.exists(`withOutQuestions : ${id}`)
    // const questions = await redis.exists(`withQuestions : ${id}`)
    
    // if(details){
    //     await redis.get(`withOutQuestions : ${id}`).then((result) => {
    //         if(result != null){
    //             const jresult = JSON.parse(result)
    //             console.log(` Cached Data : ${jresult}`); // Prints "value"
    //             res.status(200).json(jresult)
    //         }
    //         // else{
    //         //     next()
    //         // }
    //     })    
    // }else if(questions){
    //     await redis.get(`withOutQuestions : ${id}`).then((result) => {
    //         if(result != null){
    //             const jresult = JSON.parse(result)
    //             console.log(` Cached Data : ${jresult}`); // Prints "value"
    //             res.status(200).json(jresult)
    //         }
    //         // else{
    //         //     next()
    //         // }
    //     })        
    // }else{
    //     next()
    // }
    
}


const expEvent = ()=>{
    // const sub = redis
    // const pub = redis
    // const subKey = '__keyevent@0__:expired';
    // const myKey = 'myKey'

    // sub.subscribe(myKey, () => {
    //     console.log('Subscribed to key expiration events!');
    // });

    // sub.on('message', (channel, message) => {
    //     console.log(`Key expired: ${message}`);
    //     // Handle the expired key event here
    // });

        
    // Example: Set a key to expire in 5 seconds
    // const testKey = 'myKey';
    // pub.multi()
    //     .set(testKey, 'test redis notify')
    //     .expire(testKey, 60)
    //     .exec((err) => {
    //         if (err) {
    //             console.error(err);
    //         }
    //     }
    // );        
}


module.exports = {cached,expEvent}