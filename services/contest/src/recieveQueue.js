const amqp = require('amqplib')
const {setupDatabase} = require('./db/setup')

const {addSubmitByMessage,deleteSubmitsByMessage} = require('./controllers/contestController')

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

try{
    recieveFromQueue('setup', async (msg)=>{
        console.log(`Recieved Setup Msg : ${msg}`)
        try{
            await setupDatabase()
        }catch(err){
            console.log(err)
        }
    })
}
catch(err){
    console.log("Console from setup Queue :")
    console.log(err)
}

try{
    recieveSubmitFromQueue('submit', (msg)=>{
        const data = JSON.parse(msg)
        addSubmitByMessage(data)
    })
}
catch(err){
    console.log("Console from submit Queue :")
    console.log(err)
}

try{
    recieveSubmitFromQueue('result', (msg)=>{  // working good
        const contest_id = msg.replace('result done id:','')
        deleteSubmitsByMessage(contest_id)
    })
}
catch(err){
    console.log("Console from result Queue :")
    console.log(err)
}

module.exports = {recieveSubmitFromQueue}