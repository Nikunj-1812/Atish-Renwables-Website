const { Lead } = require('../models');
const { validateSolarPayload } = require('../utils/requestValidators');
const { calculateSolarEstimateData } = require('../services/solarService');
const { generateSolarReportPdf } = require('../services/pdfService');
const { sendSolarReportEmail } = require('../services/emailService');
const { sendError, sendSuccess } = require('../utils/apiResponse');
const { getIsConnected } = require('../config/db');

const calculateSolarEstimate = async (req, res) => {
  try {
    const invalidFields = validateSolarPayload(req.body);

    if (invalidFields.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'Pincode and monthly bill / input value must be valid.',
        errors: invalidFields,
      });
    }

    const estimate = calculateSolarEstimateData(req.body);

    if (!estimate) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid calculation inputs.',
      });
    }

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

      const leadPayload = {
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        email: req.body.email ? req.body.email.trim() : 'calculator',
        city: cityValue,
        requirement: req.body.customerType === 'commercial' ? 'commercial' : 'residential',
        monthlyBill: Number(estimate.monthlyElectricityBill),
        message: `Solar Calculator Estimate Submission. Input Mode: ${req.body.inputMode || 'bill'}. Pincode: ${req.body.pincode.trim()}.${!isDefaultLoc ? ` Matched Location: ${estimate.location}.` : ''}`,
        notes: `Estimate Details:\n- Input Mode: ${req.body.inputMode || 'bill'}\n- System Size: ${estimate.systemSizeKw} kW\n- Total Cost: ₹${estimate.netCost}\n- Payback Period: ${estimate.paybackPeriodYears} years\n- Monthly Savings: ₹${estimate.monthlySavings}\n- Yearly Savings: ₹${estimate.yearlySavings}\n- ROI: ${estimate.roi}%\n- Environmental Score: ${estimate.environmentalScore}/100`,
      };

      if (getIsConnected()) {
        await Lead.create(leadPayload);
      } else {
        console.warn('⚠️ Offline Database Mode: Skipped database insertion. CRM Lead details logged to console:');
        console.dir(leadPayload);
      }
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

const downloadPdfReport = async (req, res) => {
  try {
    const {
      inputMode,
      inputValue,
      customerType,
      pincode,
      state,
      name,
      phone,
      email,
    } = req.query;

    const estimate = calculateSolarEstimateData({
      inputMode,
      inputValue: parseFloat(inputValue),
      customerType,
      pincode,
    });

    if (!estimate) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid parameters for PDF report.',
      });
    }

    const reportData = {
      ...estimate,
      name: name || 'Valued Customer',
      phone: phone || 'N/A',
      email: email || '',
      state: state || 'Gujarat',
      pincode: pincode || 'N/A',
    };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Atish_Renewables_Solar_Report_${estimate.systemSizeKw}kW.pdf"`);

    generateSolarReportPdf(reportData, res);
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to generate PDF report.',
      errors: [error.message],
    });
  }
};

const emailReport = async (req, res) => {
  try {
    const {
      inputMode,
      inputValue,
      customerType,
      pincode,
      state,
      name,
      phone,
      email,
    } = req.body;

    if (!email) {
      return sendError(res, {
        statusCode: 400,
        message: 'Email address is required to send report.',
      });
    }

    const estimate = calculateSolarEstimateData({
      inputMode,
      inputValue: parseFloat(inputValue),
      customerType,
      pincode,
    });

    if (!estimate) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid parameters for email report.',
      });
    }

    const reportData = {
      ...estimate,
      name: name || 'Valued Customer',
      phone: phone || 'N/A',
      email: email || '',
      state: state || 'Gujarat',
      pincode: pincode || 'N/A',
    };

    const doc = new (require('pdfkit'))({ margin: 50, size: 'A4' });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);
        const emailResult = await sendSolarReportEmail(email, reportData, pdfBuffer);
        return sendSuccess(res, {
          statusCode: 200,
          message: 'Solar report email sent successfully.',
          data: emailResult,
        });
      } catch (emailErr) {
        console.error('Email Dispatch Error:', emailErr);
        return sendError(res, {
          statusCode: 500,
          message: 'Failed to send email report.',
          errors: [emailErr.message],
        });
      }
    });

    generateSolarReportPdf(reportData, doc);
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to email report.',
      errors: [error.message],
    });
  }
};

module.exports = {
  calculateSolarEstimate,
  downloadPdfReport,
  emailReport,
};