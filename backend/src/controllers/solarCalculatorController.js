const { Lead } = require('../models');
const { validateSolarPayload } = require('../utils/requestValidators');
const { calculateSolarEstimateData } = require('../services/solarService');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const calculateSolarEstimate = async (req, res) => {
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

    // Save as CRM Lead if name and phone are provided
    if (req.body.name && req.body.phone) {
      const isNumericPincode = /^\d+$/.test(req.body.pincode.trim());
      const isDefaultLoc = !estimate.location || estimate.location === 'default';
      
      let cityValue = '';
      if (!isDefaultLoc) {
        cityValue = `${estimate.location} (${req.body.pincode.trim()})`;
      } else {
        cityValue = isNumericPincode ? `Pincode: ${req.body.pincode.trim()}` : req.body.pincode.trim();
      }

      await Lead.create({
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        email: 'calculator',
        city: cityValue,
        requirement: 'residential',
        monthlyBill: Number(req.body.monthlyElectricityBill),
        message: `Solar Calculator Estimate Submission. Input: ${req.body.pincode.trim()}.${!isDefaultLoc ? ` Matched Location: ${estimate.location}.` : ''}`,
        notes: `Estimate Details:\n- System Size: ${estimate.systemSizeKw} kW\n- Estimated Cost: ₹${estimate.totalCost}\n- Payback Period: ${estimate.paybackPeriodYears} years\n- Monthly Savings: ₹${estimate.monthlySavings}\n- Yearly Savings: ₹${estimate.yearlySavings}`,
      });
    }

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