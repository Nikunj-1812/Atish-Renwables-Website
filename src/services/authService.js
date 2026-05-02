const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticateAdmin = async ({ username, password }) => {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminUsername || !adminPasswordHash || !jwtSecret) {
    const error = new Error('Authentication environment variables are not configured.');
    error.statusCode = 500;
    throw error;
  }

  const isUsernameMatch = username === adminUsername;
  const isPasswordMatch = await bcrypt.compare(password, adminPasswordHash);

  if (!isUsernameMatch || !isPasswordMatch) {
    const error = new Error('Invalid admin credentials.');
    error.statusCode = 401;
    throw error;
  }

  return jwt.sign(
    {
      role: 'admin',
      username: adminUsername,
    },
    jwtSecret,
    { expiresIn: '1d' }
  );
};

module.exports = {
  authenticateAdmin,
};