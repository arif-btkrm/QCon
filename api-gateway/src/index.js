
const express =  require('express')
const dotenv =  require('dotenv');
const helmet =  require('helmet');
const rateLimit =  require('express-rate-limit');
const morgan =  require('morgan');
const {auth}  = require('./middlewares')
const { configureRoutes } = require('./utils')

const {sendToQueue,sendToAll} = require('./queue')

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


app.post('/api/exam/submit', auth ,(req, res) => { // will do later
	userId = req.headers['x-user-id']
	const {examId,answers} = req.body
	const now = new Date()
	// let submitTime = now.toISOString() //+ (1000*1*60*60*6) // Adding 6 hour for timezone adjustment
	// submitTime = new Date().getTime()
	// const data = {userId,examId,answers,submitTime}
	// sendToQueue('submit',JSON.stringify(data))
	console.log(`now : ${now}`)
	// console.log(`now : ${submitTime}`)

	res.status(201).json({ message:  `Submission Successful at : ${now}` });
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