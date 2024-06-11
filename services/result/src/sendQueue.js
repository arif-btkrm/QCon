const amqp = require('amqplib')

const QUEUE_URL = 'amqp://host.docker.internal'

const sendToQueue = async (queue, msg)=>{
    const connection = await amqp.connect(QUEUE_URL)
    const channel = await connection.createChannel()

    const exchange = 'submit'
    await channel.assertExchange(exchange, 'direct', {durable:true})
    channel.publish(exchange, queue, Buffer.from(msg))
    console.log(`Sent ${msg} to ${queue}`)

    setTimeout(() => {
       connection.close() 
    }, 1000);
}

module.exports = {sendToQueue}