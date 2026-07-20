const DEFAULT_ELECTRICITY_RATE = 8.4;
const DAILY_GENERATION_PER_KW = 4.8;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;
const SYSTEM_LIFETIME = 30;

const PINCODE_COST_MAP = {
  '110': { location: 'Delhi', costPerKw: 45000 },
  '122': { location: 'Gurugram', costPerKw: 47000 },
  '380': { location: 'Ahmedabad', costPerKw: 46000 },
  '390': { location: 'Vadodara', costPerKw: 45000 },
  '400': { location: 'Mumbai', costPerKw: 50000 },
  '500': { location: 'Hyderabad', costPerKw: 48000 },
  '560': { location: 'Bengaluru', costPerKw: 49000 },
  '600': { location: 'Chennai', costPerKw: 47000 },
  '700': { location: 'Kolkata', costPerKw: 46000 },
};

/**
 * Perform all solar estimates and financial/environmental calculations.
 * @param {object} params
 * @returns {object|null}
 */
function calculateSolar({
  inputMode = 'bill',
  inputValue = 0,
  customerType = 'residential',
  pincode = '',
}) {
  const rate = DEFAULT_ELECTRICITY_RATE;
  const value = Number(inputValue) || 0;

  if (value <= 0) return null;

  let rawPlantSize = 0;
  let monthlyUnits = 0;

  if (inputMode === 'bill') {
    monthlyUnits = value / rate;
    rawPlantSize = monthlyUnits / (DAILY_GENERATION_PER_KW * DAYS_PER_MONTH);
  } else if (inputMode === 'units') {
    monthlyUnits = value;
    rawPlantSize = monthlyUnits / (DAILY_GENERATION_PER_KW * DAYS_PER_MONTH);
  } else if (inputMode === 'area') {
    // 100 sq ft per kW
    rawPlantSize = value / 100;
    monthlyUnits = rawPlantSize * DAILY_GENERATION_PER_KW * DAYS_PER_MONTH;
  } else {
    return null;
  }

  // Round to nearest practical size (0.5 kW steps, min 1 kW)
  const plantSizeKw = Math.max(1, Math.round(rawPlantSize * 2) / 2);

  // Recalculate generation based on rounded plant size
  const dailyGenerationKw = plantSizeKw * DAILY_GENERATION_PER_KW;
  const monthlyGenerationKw = dailyGenerationKw * DAYS_PER_MONTH;
  const yearlyGenerationKw = dailyGenerationKw * DAYS_PER_YEAR;
  const lifetimeGenerationKw = yearlyGenerationKw * SYSTEM_LIFETIME;

  // Savings
  const monthlySavings = monthlyGenerationKw * rate;
  const yearlySavings = yearlyGenerationKw * rate;
  const lifetimeSavings = lifetimeGenerationKw * rate;

  // Pricing
  const costPerKw = customerType === 'commercial' ? 38000 : 50000;
  let location = 'default';
  const normPincode = String(pincode || '').trim();
  if (normPincode && normPincode.length >= 3) {
    const prefix = normPincode.slice(0, 3);
    const pricing = PINCODE_COST_MAP[prefix];
    if (pricing) {
      location = pricing.location;
    }
  }

  const grossCost = plantSizeKw * costPerKw;

  const netCost = grossCost;
  const finalInvestment = netCost;

  // ROI
  const roi = netCost > 0 ? ((lifetimeSavings - netCost) / netCost) * 100 : 0;

  // Payback Period
  const paybackPeriodYears = yearlySavings > 0 ? netCost / yearlySavings : 0;

  // Environmental Impact
  const co2ReductionKg = yearlyGenerationKw * 0.8;
  const treesPlanted = co2ReductionKg / 20;
  const carbonOffsetTonnes = co2ReductionKg / 1000;
  const environmentalScore = Math.min(100, Math.round(plantSizeKw * 10));

  return {
    plantSizeKw,
    dailyGenerationKw,
    monthlyGenerationKw,
    yearlyGenerationKw,
    lifetimeGenerationKw,
    grossCost,
    netCost,
    finalInvestment,
    monthlySavings,
    yearlySavings,
    lifetimeSavings,
    roi,
    paybackPeriodYears,
    co2ReductionKg,
    treesPlanted,
    carbonOffsetTonnes,
    environmentalScore,
    costPerKw,
    location,
  };
}

module.exports = {
  DEFAULT_ELECTRICITY_RATE,
  DAILY_GENERATION_PER_KW,
  DAYS_PER_MONTH,
  DAYS_PER_YEAR,
  SYSTEM_LIFETIME,
  PINCODE_COST_MAP,
  calculateSolar,
};
