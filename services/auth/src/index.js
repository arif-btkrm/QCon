const express = require('express');
const dotenv  = require('dotenv');
const cors  = require('cors');
const morgan  = require('morgan');

const {signinController,verifyToken} = require('./controllers/authController')

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));

//routes
app.get('/', (req,res)=>{
    try{
        res.status(200).send({message: "Hello from Auth-Service"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

//routes
app.get('/health', (req,res)=>{
    try{
        res.status(200).send({message: "Hello from Auth-Service and Health Ok"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

app.post('/auth/login', signinController);
app.post('/auth/verify-token', verifyToken);

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 3001;
const serviceName = process.env.SERVICE_NAME || 'Auth-Service';


app.listen(port, ()=>{console.log(`${serviceName} Server is running on port: ${port}`)})