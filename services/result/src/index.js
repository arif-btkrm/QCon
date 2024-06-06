const express = require('express');
const dotenv  = require('dotenv');
const cors  = require('cors');
const morgan  = require('morgan');

const {setupDatabase} = require('./db/setup')
const {makeResultByExamId,getResultByExamId,getMyResult} = require('./controllers/resultController')

require('./recieveQueue')

const {redis} = require('./redis/redis')
require('./redis/onKeyExpired')

// const {expEvent} = require('./redis/midlewares')

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));

//routes
app.get('/', (req,res)=>{
    console.log(setupDatabase)
    try{
        res.status(200).send({message: "Hello from Result-Service"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

//routes
app.get('/health', (req,res)=>{
    console.log(setupDatabase)
    try{
        res.status(200).send({message: "Hello from Result-Service and Health Ok"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

app.get('/setup', async (req,res)=>{
    try{
        await setupDatabase(req,res)
        res.status(201).send( {message: ` ${process.env.SERVICE_NAME} Setup Done`})

    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

// routes


app.post('/result', makeResultByExamId) // auth,isTeacher
app.get('/result/:examId', getResultByExamId) // auth 
app.get('/result/:examId', getMyResult) // auth getMyResult


// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 3006;
const serviceName = process.env.SERVICE_NAME || 'Result-Service';

// redis.setex('running_contest_id:10' ,10,"Hi from Result")




app.listen(port, ()=>{console.log(`${serviceName} Server is running on port: ${port}`)})

module.exports = app