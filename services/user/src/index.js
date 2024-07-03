const express = require('express');
const dotenv  = require('dotenv');
const cors  = require('cors');
const morgan  = require('morgan');

const {setupDatabase} = require('./db/setup')
const {signin,signup,userProfile,addTeacher,userById,getUsersByIds} = require('./controllers/userController')

const {signInValidation, signUpValidation, addTeacherValidation } = require('./middlewares/validation')
const isValidate = require('./middlewares/validation/validate')

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

app.post('/user/signup', signUpValidation, isValidate, signup)
app.post('/user/signin', signInValidation, isValidate, signin)
app.post('/user/addteacher', addTeacherValidation, isValidate, addTeacher)
app.get('/user/profile', userProfile)
app.get('/users/:id', userById)
app.post('/getusers-ids', getUsersByIds)

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