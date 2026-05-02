const { validateVCardPayload } = require('../utils/requestValidators');
const { buildVCard } = require('../services/vcardService');
const { sendError } = require('../utils/apiResponse');

const downloadVCard = (req, res) => {
  const invalidFields = validateVCardPayload(req.query);

  if (invalidFields.length > 0) {
    return sendError(res, {
      statusCode: 400,
      message: 'name, phone, email, and company are required and must be valid.',
      errors: invalidFields,
    });
  }

  const { name, phone, email, company } = req.query;
  const { fileName, vcard } = buildVCard({ name, phone, email, company });

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  return res.status(200).send(vcard);
};

module.exports = {
  downloadVCard,
};