const mongoose = require('mongoose');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_REQUIREMENTS = ['industrial', 'commercial', 'residential'];
const ALLOWED_STATUSES = ['new', 'contacted', 'converted'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const validateLoginPayload = (body = {}) => {
  const errors = [];

  if (!isNonEmptyString(body.username)) {
    errors.push('username');
  }

  if (!isNonEmptyString(body.password)) {
    errors.push('password');
  }

  return errors;
};

const validateContactPayload = (body = {}) => {
  const errors = [];
  const { name, phone, email, city, requirement, monthlyBill, message } = body;

  if (!isNonEmptyString(name)) errors.push('name');
  if (!isNonEmptyString(phone)) errors.push('phone');
  if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim())) errors.push('email');
  if (!isNonEmptyString(city)) errors.push('city');
  if (!ALLOWED_REQUIREMENTS.includes(String(requirement || '').trim())) errors.push('requirement');

  const parsedMonthlyBill = Number(monthlyBill);
  if (!Number.isFinite(parsedMonthlyBill) || parsedMonthlyBill <= 0) {
    errors.push('monthlyBill');
  }

  if (!isNonEmptyString(message)) errors.push('message');

  return errors;
};

const validateRequirementFilter = (requirement) => {
  if (!requirement) {
    return null;
  }

  const normalizedRequirement = String(requirement).trim();

  if (!ALLOWED_REQUIREMENTS.includes(normalizedRequirement)) {
    return ALLOWED_REQUIREMENTS;
  }

  return null;
};

const validateLeadStatus = (status) => {
  if (!isNonEmptyString(status)) {
    return 'required';
  }

  const normalizedStatus = String(status).trim();

  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    return ALLOWED_STATUSES;
  }

  return null;
};

const validateSolarPayload = (body = {}) => {
  const errors = [];
  const { pincode, monthlyElectricityBill } = body;

  if (!/^\d{6}$/.test(String(pincode || '').trim())) {
    errors.push('pincode');
  }

  const parsedBill = Number(monthlyElectricityBill);
  if (!Number.isFinite(parsedBill) || parsedBill <= 0) {
    errors.push('monthlyElectricityBill');
  }

  return errors;
};

const validateVCardPayload = (query = {}) => {
  const errors = [];

  if (!isNonEmptyString(query.name)) errors.push('name');
  if (!isNonEmptyString(query.phone)) errors.push('phone');
  if (!isNonEmptyString(query.email) || !EMAIL_REGEX.test(query.email.trim())) errors.push('email');
  if (!isNonEmptyString(query.company)) errors.push('company');

  return errors;
};

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

module.exports = {
  ALLOWED_REQUIREMENTS,
  ALLOWED_STATUSES,
  isValidObjectId,
  validateContactPayload,
  validateLeadStatus,
  validateLoginPayload,
  validateRequirementFilter,
  validateSolarPayload,
  validateVCardPayload,
};