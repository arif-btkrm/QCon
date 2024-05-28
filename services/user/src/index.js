const express = require('express');
const dotenv  = require('dotenv');
const cors  = require('cors');
const morgan  = require('morgan');

const {setupDatabase} = require('./db/setup')
const {signinController,signupController,userProfileController,addUserController,userByIdController} = require('./controllers/userController')

require('./recieveQueue')

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));

//routes
app.get('/', (req,res)=>{
    console.log(setupDatabase)
    try{
        res.status(200).send({message: "Hello from User-Service"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

//routes
app.get('/health', (req,res)=>{
    console.log(setupDatabase)
    try{
        res.status(200).send({message: "Hello from User-Service and Health Ok"})
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

app.post('/user/signup', signupController)
app.post('/user/signin', signinController)
app.post('/user/addUser', addUserController)
app.get('/user/profile', userProfileController)
app.get('/users/:id', userByIdController)

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 3002;
const serviceName = process.env.SERVICE_NAME || 'User-Service';


app.listen(port, ()=>{console.log(`${serviceName} Server is running on port: ${port}`)})

module.exports = app