const { getCostPerKwByPincode } = require('../config/solarPricing');

const roundToTwo = (value) => Number(value.toFixed(2));

const calculateSolarEstimateData = ({ pincode, monthlyElectricityBill }) => {
  const normalizedPincode = String(pincode).trim();
  const billAmount = Number(monthlyElectricityBill);

  const { costPerKw, matchedPrefix, location, prefix, isDefaultPrice } = getCostPerKwByPincode(normalizedPincode);

  const systemSizeKw = billAmount / 1000;
  const monthlySavings = billAmount * 0.9;
  const yearlySavings = monthlySavings * 12;
  const totalCost = systemSizeKw * costPerKw;
  const paybackPeriodYears = totalCost / yearlySavings;

  return {
    pincode: normalizedPincode,
    prefix,
    monthlyElectricityBill: roundToTwo(billAmount),
    costPerKw,
    matchedPrefix,
    location,
    isDefaultPrice,
    systemSizeKw: roundToTwo(systemSizeKw),
    monthlySavings: roundToTwo(monthlySavings),
    yearlySavings: roundToTwo(yearlySavings),
    totalCost: roundToTwo(totalCost),
    paybackPeriodYears: roundToTwo(paybackPeriodYears),
  };
};

module.exports = {
  calculateSolarEstimateData,
};