const dotenv = require ('dotenv');
dotenv.config({
    path: '.env'
})

const REDIS_PORT = process.env.REDIS_PORT? parseInt(process.env.REDIS_PORT):6379

const REDIS_HOST = process.env.REDIS_HOST || 'host.docker.internal'


module.exports = {REDIS_HOST,REDIS_PORT}



