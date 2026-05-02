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

const DEFAULT_COST_PER_KW = 49000;
const DEFAULT_LOCATION = 'default';

const getCostPerKwByPincode = (pincode) => {
  const normalizedPincode = String(pincode).trim();
  const prefix = normalizedPincode.slice(0, 3);
  const pricing = PINCODE_COST_MAP[prefix];

  return {
    prefix,
    matchedPrefix: pricing ? prefix : DEFAULT_LOCATION,
    location: pricing ? pricing.location : DEFAULT_LOCATION,
    costPerKw: pricing ? pricing.costPerKw : DEFAULT_COST_PER_KW,
    isDefaultPrice: !pricing,
  };
};

module.exports = {
  DEFAULT_COST_PER_KW,
  DEFAULT_LOCATION,
  PINCODE_COST_MAP,
  getCostPerKwByPincode,
};