const { validateSolarPayload } = require('../utils/requestValidators');
const { calculateSolarEstimateData } = require('../services/solarService');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const calculateSolarEstimate = (req, res) => {
  try {
    const invalidFields = validateSolarPayload(req.body);

    if (invalidFields.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'pincode and monthlyElectricityBill must be valid.',
        errors: invalidFields,
      });
    }

    const estimate = calculateSolarEstimateData(req.body);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Solar estimate calculated successfully.',
      data: {
        estimate,
        assumptions: {
          systemSizeFormula: 'monthlyElectricityBill / 1000',
          monthlySavingsFormula: 'monthlyElectricityBill * 0.9',
          paybackPeriodFormula: 'totalCost / yearlySavings',
        },
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to calculate solar estimate.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

module.exports = {
  calculateSolarEstimate,
};