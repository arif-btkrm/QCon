const express = require('express');
const dotenv  = require('dotenv');
const cors  = require('cors');
const morgan  = require('morgan');

const {setupDatabase} = require('./db/setup')
const {addContest,getContests,getContestById,addSubmit,getSubmitsByContestId} = require('./controllers/contestController')

const {cached} = require('./redis/midlewares');

require('./recieveQueue')

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));

//routes
app.get('/', (req,res)=>{
    // console.log(setupDatabase)
    try{
        res.status(200).send({message: "Hello from Contest-Service"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

//routes
app.get('/health', (req,res)=>{
    // console.log(setupDatabase)
    try{
        res.status(200).send({message: "Hello from Contest-Service and Health Ok"})
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

app.post('/contest', addContest)
app.get('/contests', getContests)
app.get('/contests/:id', cached, getContestById)
app.post('/contest/submit', addSubmit)
app.get('/submits/:contestid', getSubmitsByContestId)


// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 3004;
const serviceName = process.env.SERVICE_NAME || 'Contest-Service';

// const now = new Date()
// console.log(` Now : ${now}`)

app.listen(port, ()=>{console.log(`${serviceName} Server is running on port: ${port}`)})


module.exports = app