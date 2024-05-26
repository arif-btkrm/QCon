const amqp = require('amqplib')

const QUEUE_URL = 'amqp://host.docker.internal'

const sendToQueue = async (queue, msg)=>{
    const connection = await amqp.connect(QUEUE_URL)
    const channel = await connection.createChannel()

    const exchange = 'setup'
    await channel.assertExchange(exchange, 'fanout', {durable:true})
    channel.publish(exchange, "", Buffer.from(msg))
    console.log(`Sent ${msg} to ${queue}`)

    setTimeout(() => {
       connection.close() 
    }, 1000);
}

module.exports = sendToQueue