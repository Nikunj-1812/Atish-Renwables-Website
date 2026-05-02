const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null,
    errors: ['Route not found'],
  });
};

module.exports = notFound;