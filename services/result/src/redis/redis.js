const { Redis } = require('ioredis');
const {REDIS_HOST,REDIS_PORT,REDIS_TTL} = require('./config')

const redis = new Redis({
    host : REDIS_HOST,
    port : REDIS_PORT,
    ttl : REDIS_TTL
})

module.exports = {redis};