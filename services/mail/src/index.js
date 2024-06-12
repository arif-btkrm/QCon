const express = require('express');
const dotenv  = require('dotenv');
const cors  = require('cors');
const morgan  = require('morgan');
const {mail} = require('./mail')

dotenv.config();

const app = express()
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));

await mail().catch(e => console.log(e))

//routes
app.get('/', (req,res)=>{
    try{
        res.status(200).send({message: "Hello from Mail-Service"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})

//routes
app.get('/health', (req,res)=>{
    try{
        res.status(200).send({message: "Hello from Mail-Service and Health Ok"})
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }   
})


// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 3007;
const serviceName = process.env.SERVICE_NAME || 'Mail-Service';


app.listen(port, ()=>{console.log(`${serviceName} Server is running on port: ${port}`)})

module.exports = app