const parseAllowedOrigins = (value) => {
	const defaultOrigins = [
		'http://localhost:5173',
		'http://localhost:5174',
		'http://localhost:5000',
		'https://atish-renwables-admin.vercel.app',
		'https://atish-renwables-website.vercel.app',
		'https://atish-renewables-admin.vercel.app',
		'https://atish-renewables-website.vercel.app',
	];

	if (!value) {
		return defaultOrigins;
	}

	return Array.from(new Set([
		...defaultOrigins,
		...value
			.split(',')
			.map((origin) => origin.trim())
			.filter(Boolean),
	]));
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