
const express =  require('express')
const dotenv =  require('dotenv');
const helmet =  require('helmet');
const rateLimit =  require('express-rate-limit');
const morgan =  require('morgan');

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

// TODO: Auth middleware

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