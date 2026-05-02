const { sendSuccess } = require('../utils/apiResponse');

const getHealthStatus = (req, res) => {
	return sendSuccess(res, {
		statusCode: 200,
		message: 'API is healthy',
		data: {},
	});
};

module.exports = {
  getHealthStatus,
};