const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { parseAllowedOrigins } = require('./config/env');
const { sendSuccess } = require('./utils/apiResponse');

const app = express();
const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		return callback(new Error('CORS not allowed for this origin'));
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
	sendSuccess(res, {
		statusCode: 200,
		message: 'Server is running',
		data: { status: 'Backend is healthy and ready for requests.' },
	});
});

app.get('/api', (req, res) => {
	sendSuccess(res, {
		statusCode: 200,
		message: 'API is running',
		data: { version: '1.0.0' },
	});
});

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;