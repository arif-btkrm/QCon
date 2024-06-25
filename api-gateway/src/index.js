
const express =  require('express')
const dotenv =  require('dotenv');
const helmet =  require('helmet');
const rateLimit =  require('express-rate-limit');
const morgan =  require('morgan');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDoc = YAML.load('./swagger.yaml');
const OpenApiValidator = require('express-openapi-validator');

const {auth, isStudent}  = require('./middlewares')
const { configureRoutes } = require('./utils')

const {sendToQueue,sendToAll} = require('./queue')

const {redis} = require('./redis/redis')

dotenv.config();

const app = express();

// security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	handler: (_req, res) => {
		res
			.status(429)
			.json({ message: 'Too many requests, please try again later.' });
	},
});
app.use('/api', limiter);

// request logger
app.use(morgan('dev'));
app.use(express.json());

// app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
// app.use(
// 	OpenApiValidator.middleware({
// 		apiSpec: './swagger.yaml',
// 	})
// );

// routes
configureRoutes(app);

// health check
app.get('/health', (_req, res) => {
	res.status(200).json({ message: 'API Gateway is running and Health OK' });
});

// health check
app.get('/admin/setup', (_req, res) => {
	sendToAll('run service setup')
	res.json({ message: 'Hello from /setup Route' });
});

// Submit Part


app.post('/api/v1/contest/submit', auth, isStudent, async (req, res) => { // will do later
	
	userId = req.headers['x-user-id']
	const {contestId,answers} = req.body
	// check contes is running or not
    const running = await redis.exists(`running_contest_id:${contestId}`)
	if(running){
		await redis.get(`running_contest_id:${contestId}`).then((result) => {
			if(result === 'running...'){
				console.log(` result : ${result}`)
				
				const now = new Date()
				const submitTime = now

				// let submitTime = now.toISOString() 
				//  submitTime = now.getTime()
				 
				const data = {contestId,userId,answers,submitTime}
				const sdata = JSON.stringify(data)
				// console.log(sdata)
				sendToQueue('submit',sdata)
				//  console.log(`now : ${submitTime}`)
				 res.status(201).json({ message: `Submission Successful` });			
            }
            else{
                res.status(406).json({ message: `Oppss Somthing Wrong... :( ` });
            }
        }) 
	
	}
	else{
		res.status(200).json({ message: `Oppss Contest Not Running... :( ` });	
	}
});





// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not Found' });
});

// error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`API Gateway is running on port ${PORT}`);
});

module.exports = app