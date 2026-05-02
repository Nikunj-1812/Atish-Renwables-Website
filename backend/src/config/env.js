const parseAllowedOrigins = (value) => {
	if (!value) {
		return ['http://localhost:3000', 'http://localhost:5173'];
	}

	return value
		.split(',')
		.map((origin) => origin.trim())
		.filter(Boolean);
};

const validateRequiredEnv = () => {
	const requiredVariables = ['MONGO_URI', 'JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH'];
	const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

	if (missingVariables.length > 0) {
		throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
	}
};

module.exports = {
	parseAllowedOrigins,
	validateRequiredEnv,
};