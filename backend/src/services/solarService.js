const { calculateSolar } = require('../utils/solarCalculator');

/**
 * Service calculation wrapper for solar estimations on the backend
 * @param {object} payload
 * @returns {object|null}
 */
const calculateSolarEstimateData = (payload = {}) => {
  const inputMode = payload.inputMode || 'bill';
  const inputValue = Number(payload.inputValue) || Number(payload.monthlyElectricityBill) || 0;
  const electricityRate = 8.4;
  const customerType = payload.customerType || 'residential';
  const pincode = String(payload.pincode || '').trim();
  const result = calculateSolar({
    inputMode,
    inputValue,
    customerType,
    pincode,
  });

  if (!result) return null;

  const roundToTwo = (value) => Number(Number(value).toFixed(2));

  return {
    ...result,
    // Map compatible legacy fields
    pincode,
    monthlyElectricityBill: inputMode === 'bill' ? roundToTwo(inputValue) : roundToTwo(result.monthlyGenerationKw * electricityRate),
    systemSizeKw: roundToTwo(result.plantSizeKw),
    totalCost: roundToTwo(result.netCost),
    grossCost: roundToTwo(result.grossCost),
    netCost: roundToTwo(result.netCost),
    monthlySavings: roundToTwo(result.monthlySavings),
    yearlySavings: roundToTwo(result.yearlySavings),
    lifetimeSavings: roundToTwo(result.lifetimeSavings),
    paybackPeriodYears: roundToTwo(result.paybackPeriodYears),
    roi: roundToTwo(result.roi),
  };
};

module.exports = {
  calculateSolarEstimateData,
};