const path = require('path');
const fs = require('fs');
const { sendError } = require('../utils/apiResponse');

const downloadBrochure = (req, res) => {
  const brochurePath = path.join(__dirname, '..', '..', 'public', 'Atish Renewables Brochure.pdf');

  if (!fs.existsSync(brochurePath)) {
    return sendError(res, {
      statusCode: 404,
      message: 'Brochure file not found.',
    });
  }

  return res.download(brochurePath, 'Atish Renewables Brochure.pdf', (error) => {
    if (error) {
      return sendError(res, {
        statusCode: 500,
        message: 'Failed to download brochure.',
        errors: [error.message],
      });
    }
    return undefined;
  });
};

module.exports = {
  downloadBrochure,
};