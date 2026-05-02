const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    data: null,
    errors: Array.isArray(err.errors) ? err.errors : err.message ? [err.message] : [],
  });
};

module.exports = errorHandler;