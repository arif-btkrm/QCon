const amqp = require('amqplib')

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

recieveFromQueue('setup', (msg)=>{
    console.log(`Recieved Setup Msg : ${msg}`)
})