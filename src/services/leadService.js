const { Lead } = require('../models');
const {
  isValidObjectId,
  validateLeadStatus,
  validateRequirementFilter,
} = require('../utils/requestValidators');

const getLeads = async ({ requirement }) => {
  const invalidRequirements = validateRequirementFilter(requirement);

  if (invalidRequirements) {
    const error = new Error('Invalid requirement filter.');
    error.statusCode = 400;
    error.meta = { allowedRequirements: invalidRequirements };
    throw error;
  }

  const query = {};

  if (requirement) {
    query.requirement = String(requirement).trim();
  }

  return Lead.find(query).sort({ createdAt: -1 });
};

const updateLeadStatusById = async ({ id, status }) => {
  if (!isValidObjectId(id)) {
    const error = new Error('Invalid lead ID.');
    error.statusCode = 400;
    throw error;
  }

  const invalidStatus = validateLeadStatus(status);

  if (invalidStatus === 'required') {
    const error = new Error('Status is required.');
    error.statusCode = 400;
    throw error;
  }

  if (invalidStatus) {
    const error = new Error('Invalid status value.');
    error.statusCode = 400;
    error.meta = { allowedStatuses: invalidStatus };
    throw error;
  }

  return Lead.findByIdAndUpdate(
    id,
    { status: String(status).trim() },
    { new: true, runValidators: true }
  );
};

const deleteLeadById = async ({ id }) => {
	if (!isValidObjectId(id)) {
		const error = new Error('Invalid lead ID.');
		error.statusCode = 400;
		throw error;
	}

	return Lead.findByIdAndDelete(id);
};

module.exports = {
  deleteLeadById,
  getLeads,
  updateLeadStatusById,
};