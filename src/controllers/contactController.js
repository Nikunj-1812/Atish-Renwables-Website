const { validateContactPayload } = require('../utils/requestValidators');
const { createContactLead } = require('../services/contactService');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const submitContactForm = async (req, res) => {
  try {
    const missingFields = validateContactPayload(req.body);

    if (missingFields.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'Please provide valid contact form data.',
        errors: missingFields,
      });
    }

    const lead = await createContactLead(req.body);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Contact form submitted successfully.',
      data: lead,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to submit contact form.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

module.exports = {
  submitContactForm,
};