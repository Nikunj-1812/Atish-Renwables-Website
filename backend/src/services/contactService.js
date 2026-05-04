const { Lead } = require('../models');

const createContactLead = async ({ name, phone, email, city, requirement, monthlyBill, message }) => {
  const leadData = {
    name,
    phone,
    email,
    city,
    requirement,
    message,
  };

  // Only include monthlyBill if provided and valid
  if (monthlyBill !== undefined && monthlyBill !== null && monthlyBill !== '') {
    leadData.monthlyBill = Number(monthlyBill);
  }

  return Lead.create(leadData);
};

module.exports = {
  createContactLead,
};