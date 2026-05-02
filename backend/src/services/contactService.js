const { Lead } = require('../models');

const createContactLead = async ({ name, phone, email, city, requirement, monthlyBill, message }) =>
  Lead.create({
    name,
    phone,
    email,
    city,
    requirement,
    monthlyBill: Number(monthlyBill),
    message,
  });

module.exports = {
  createContactLead,
};