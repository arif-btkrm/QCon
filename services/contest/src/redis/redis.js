const { Redis } = require('ioredis');
const {REDIS_HOST,REDIS_PORT,REDIS_TTL} = require('./config')

const redis = new Redis({
    host : REDIS_HOST,
    port : REDIS_PORT,
    ttl : REDIS_TTL
})


// // Subscribe to the key expiration event
// redis.subscribe('__keyevent@0__:expired', (err) => {
//     if (err) {
//         console.error('Error subscribing to key expiration event:', err);
//         return;
//     }
//     console.log('Subscribed to key expiration events');
// });

// redis.setex('myKey', 60 ,'myValue', ); // Set a TTL of 3600 seconds (1 hour)

// // Handle the expiration event
// redis.on('message', (channel, message) => {
//     if (channel === '__keyevent@0__:expired') {
//         const expiredKey = message; // The key that expired
//         console.log(`Key "${expiredKey}" has expired.`);
//         // Your custom logic here
//     }
// });



module.exports = {redis};