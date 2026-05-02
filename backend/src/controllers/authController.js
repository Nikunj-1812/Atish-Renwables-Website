const { validateLoginPayload } = require('../utils/requestValidators');
const { authenticateAdmin } = require('../services/authService');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const loginAdmin = async (req, res) => {
  try {
    const errors = validateLoginPayload(req.body);

    if (errors.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'username and password are required.',
        errors,
      });
    }

    const { username, password } = req.body;
    const token = await authenticateAdmin({ username, password });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Login successful.',
      data: { token },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to login admin.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const logoutAdmin = (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Logout successful.',
    data: { loggedOut: true },
  });
};

module.exports = {
  logoutAdmin,
  loginAdmin,
};