const { Redis } = require('ioredis');
const {REDIS_HOST,REDIS_PORT} = require('./config')
const {makeResultByExamIdEvent} = require('./../controllers/resultController')
const {recieveSubmitFromQueue} = require('./../recieveQueue')
const redis = new Redis({
    host : REDIS_HOST,
    port : REDIS_PORT,
})


const CHANNEL_KEY = '__keyevent@0__:expired'
redis.config('SET','notify-keyspace-events','Ex')
redis.subscribe(CHANNEL_KEY)

redis.on('message', async(ch,msg)=>{
    if(ch === CHANNEL_KEY){
        console.log(`Expired Key : ${msg}`) 
        if(msg.includes('running_contest_id:')){
            id = msg.replace('running_contest_id:','')
            console.log(`Expired ID : ${id}`)
            
            // let msgCount = recieveSubmitFromQueue('submit')
            // console.log(msgCount)
            // do{
            //     msgCount = recieveSubmitFromQueue('submit')

            // console.log(`Messege Count : ${msgCount}`)
            // }while(msgCount != 0)

             // check message count from message queue
            // if(msgCount == 0){
                makeResultByExamIdEvent(id) // not finalized just a trial
            // }
             // send a message to start calculate result with contest id

        }
    }
})