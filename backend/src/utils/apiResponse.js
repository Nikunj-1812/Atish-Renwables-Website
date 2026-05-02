const sendSuccess = (res, { statusCode = 200, message = 'Success', data = {}, errors = [] } = {}) => {
  const payload = {
    success: true,
    message,
    data,
    errors,
  };

  return res.status(statusCode).json(payload);
};

const sendError = (res, { statusCode = 500, message = 'Internal server error', errors } = {}) => {
  const payload = {
    success: false,
    message,
    data: null,
    errors: Array.isArray(errors) ? errors : errors ? [errors] : [],
  };

  return res.status(statusCode).json(payload);
};

module.exports = {
  sendError,
  sendSuccess,
};