const amqp = require('amqplib')
const {setupDatabase} = require('./db/setup')
// const { json } = require('express')
const {addExam,getExams,getExamById,addSubmitByMessage} = require('./controllers/examController')

const QUEUE_URL = 'amqp://host.docker.internal'

const recieveFromQueue = async (queue, callback)=>{
    const connection = await amqp.connect(QUEUE_URL)
    const channel = await connection.createChannel()

    const exchange = 'setup'
    await channel.assertExchange(exchange, 'fanout', {durable:true})

    const q = await channel.assertQueue('', {exclusive: true})
    await channel.bindQueue(q.queue, exchange, '')

    channel.consume(q.queue, (msg)=>{
        if(msg){
            callback(msg.content.toString())
        }
    }, {noAck : true})
}

recieveFromQueue('setup', async (msg)=>{
    console.log(`Recieved Setup Msg : ${msg}`)
    try{
        await setupDatabase()
    }catch(err){
        console.log(err)
    }
})

const recieveSubmitFromQueue = async (queue, callback)=>{
    const connection = await amqp.connect(QUEUE_URL)
    const channel = await connection.createChannel()

    const exchange = 'submit'
    await channel.assertExchange(exchange, 'direct', {durable:true})

    const q = await channel.assertQueue(queue, {durable:true})
    await channel.bindQueue(q.queue, exchange, queue)

    channel.consume(q.queue, (msg)=>{
        if(msg){
            callback(msg.content.toString())
        }
    }, {noAck : true})
}

recieveSubmitFromQueue('submit', (msg)=>{
    // console.log(msg)
    const data = JSON.parse(msg)
    // console.log(`Recieved Submit Msg : ${data}`)
    // console.log(data)

    // Do The corresponding Task
    addSubmitByMessage(data)
})

module.exports = {recieveSubmitFromQueue}