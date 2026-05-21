const mongoose = require('mongoose');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_REQUIREMENTS = ['industrial', 'commercial', 'residential'];
const ALLOWED_STATUSES = ['new', 'in_progress', 'contacted', 'converted', 'rejected'];
const ALLOWED_PROJECT_CATEGORIES = ['industrial', 'commercial', 'residential'];

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

  // monthlyBill is optional - only validate if provided
  if (monthlyBill !== undefined && monthlyBill !== null && monthlyBill !== '') {
    const parsedMonthlyBill = Number(monthlyBill);
    if (!Number.isFinite(parsedMonthlyBill) || parsedMonthlyBill < 0) {
      errors.push('monthlyBill');
    }
  }

  // message is optional - no validation needed

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

const validateProjectPayload = (body = {}, { requireImageUrl = false } = {}) => {
  const errors = [];
  const { projectName, imageUrl, location, city, district, category, systemSizeKw, description } = body;

  if (!isNonEmptyString(projectName)) errors.push('projectName');
  if (requireImageUrl && !isNonEmptyString(imageUrl)) errors.push('imageUrl');
  if (!isNonEmptyString(location)) errors.push('location');
  if (!isNonEmptyString(city)) errors.push('city');
  if (!isNonEmptyString(district)) errors.push('district');
  if (!ALLOWED_PROJECT_CATEGORIES.includes(String(category || '').trim())) errors.push('category');

  const parsedSystemSize = Number(systemSizeKw);
  if (systemSizeKw !== undefined && (!Number.isFinite(parsedSystemSize) || parsedSystemSize <= 0)) {
    errors.push('systemSizeKw');
  }

  if (!isNonEmptyString(description)) errors.push('description');

  return errors;
};

const validateTeamPayload = (body = {}, { requireImageUrl = false } = {}) => {
  const errors = [];
  const { name, role, imageUrl, virtualCardLink } = body;

  if (!isNonEmptyString(name)) errors.push('name');
  if (!isNonEmptyString(role)) errors.push('role');
  if (requireImageUrl && !isNonEmptyString(imageUrl)) errors.push('imageUrl');

  if (isNonEmptyString(virtualCardLink)) {
    try {
      // eslint-disable-next-line no-new
      new URL(virtualCardLink.trim());
    } catch {
      errors.push('virtualCardLink');
    }
  }

  return errors;
};

const validateSolarPayload = (body = {}) => {
  const errors = [];
  const { pincode, monthlyElectricityBill, name, phone } = body;

  if (!isNonEmptyString(pincode)) {
    errors.push('pincode');
  }

  const parsedBill = Number(monthlyElectricityBill);
  if (!Number.isFinite(parsedBill) || parsedBill <= 0) {
    errors.push('monthlyElectricityBill');
  }

  if (name !== undefined && !isNonEmptyString(name)) {
    errors.push('name');
  }

  if (phone !== undefined && !isNonEmptyString(phone)) {
    errors.push('phone');
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
  ALLOWED_PROJECT_CATEGORIES,
  ALLOWED_STATUSES,
  isValidObjectId,
  validateContactPayload,
  validateLeadStatus,
  validateLoginPayload,
  validateProjectPayload,
  validateRequirementFilter,
  validateSolarPayload,
  validateTeamPayload,
  validateVCardPayload,
};