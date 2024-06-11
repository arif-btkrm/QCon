const { Redis } = require('ioredis');
const {REDIS_HOST,REDIS_PORT} = require('./config')
const {makeResultByExamIdEvent} = require('./../controllers/resultController')
const {getQueMessageCount} = require('./../recieveQueue')
const redis = new Redis({
    host : REDIS_HOST,
    port : REDIS_PORT,
})


const CHANNEL_KEY = '__keyevent@0__:expired'
redis.config('SET','notify-keyspace-events','Ex')
redis.subscribe(CHANNEL_KEY)

redis.on('message', async(ch,msg)=>{  // Need to organize the expired events to automate
    if(ch === CHANNEL_KEY){
        console.log(`Expired Key : ${msg}`) 
        if(msg.includes('running_contest_id:')){
            id = msg.replace('running_contest_id:','')
            console.log(`Expired ID : ${id}`)
            
            const queuedMsg = getQueMessageCount('submit') // This part should be assynchronus
            
            if(queuedMsg == 0){
                makeResultByExamIdEvent(id) 
            }
             

        }
    }
})