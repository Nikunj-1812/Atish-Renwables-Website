const { Lead } = require('../models');
const {
  isValidObjectId,
  ALLOWED_STATUSES,
  validateLeadStatus,
  validateRequirementFilter,
} = require('../utils/requestValidators');

const toDateBoundary = (value, endOfDay = false) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
};

const buildLeadQuery = ({ requirement, status, search, dateFrom, dateTo }) => {
  const invalidRequirements = validateRequirementFilter(requirement);

  if (invalidRequirements) {
    const error = new Error('Invalid requirement filter.');
    error.statusCode = 400;
    error.meta = { allowedRequirements: invalidRequirements };
    throw error;
  }

  if (status && !ALLOWED_STATUSES.includes(String(status).trim())) {
    const error = new Error('Invalid status filter.');
    error.statusCode = 400;
    error.meta = { allowedStatuses: ALLOWED_STATUSES };
    throw error;
  }

  const query = {};

  if (requirement) {
    query.requirement = String(requirement).trim();
  }

  if (status) {
    query.status = String(status).trim();
  }

  const createdAt = {};
  const fromDate = toDateBoundary(dateFrom, false);
  const toDate = toDateBoundary(dateTo, true);

  if (fromDate) {
    createdAt.$gte = fromDate;
  }

  if (toDate) {
    createdAt.$lte = toDate;
  }

  if (Object.keys(createdAt).length > 0) {
    query.createdAt = createdAt;
  }

  if (search && String(search).trim()) {
    const searchRegex = new RegExp(String(search).trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { phone: searchRegex },
      { email: searchRegex },
      { city: searchRegex },
    ];
  }

  return query;
};

const resolveSort = (sortBy, sortOrder) => {
  const allowedSortFields = ['createdAt', 'name', 'monthlyBill', 'status', 'city'];
  const normalizedSortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const normalizedSortOrder = String(sortOrder || 'desc').toLowerCase() === 'asc' ? 1 : -1;

  return { [normalizedSortField]: normalizedSortOrder };
};

const getLeads = async ({
  requirement,
  status,
  search,
  dateFrom,
  dateTo,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) => {
  const query = buildLeadQuery({ requirement, status, search, dateFrom, dateTo });
  const sort = resolveSort(sortBy, sortOrder);

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  const [leads, total] = await Promise.all([
    Lead.find(query).sort(sort).skip(skip).limit(safeLimit),
    Lead.countDocuments(query),
  ]);

  return {
    leads,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
};

const getLeadById = async ({ id }) => {
  if (!isValidObjectId(id)) {
    const error = new Error('Invalid lead ID.');
    error.statusCode = 400;
    throw error;
  }

  return Lead.findById(id);
};

const updateLeadById = async ({ id, status, notes }) => {
  if (!isValidObjectId(id)) {
    const error = new Error('Invalid lead ID.');
    error.statusCode = 400;
    throw error;
  }

  const updatePayload = {};

  if (status !== undefined) {
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

    updatePayload.status = String(status).trim();
  }

  if (notes !== undefined) {
    if (typeof notes !== 'string') {
      const error = new Error('Notes must be a string.');
      error.statusCode = 400;
      throw error;
    }

    updatePayload.notes = notes.trim();
  }

  if (Object.keys(updatePayload).length === 0) {
    const error = new Error('No valid fields provided for update.');
    error.statusCode = 400;
    throw error;
  }

  const existingLead = await Lead.findById(id);

  if (!existingLead) {
    return null;
  }

  if (updatePayload.status && existingLead.status !== updatePayload.status) {
    const nextHistory = Array.isArray(existingLead.statusHistory) ? [...existingLead.statusHistory] : [];
    nextHistory.push({ status: updatePayload.status, changedAt: new Date() });
    updatePayload.statusHistory = nextHistory;
  }

  return Lead.findByIdAndUpdate(
    id,
    updatePayload,
    { new: true, runValidators: true }
  );
};

const getLeadStats = async () => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalLeads, todayLeads, monthlyLeads, convertedLeads] = await Promise.all([
    Lead.countDocuments({}),
    Lead.countDocuments({ createdAt: { $gte: startOfToday } }),
    Lead.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Lead.countDocuments({ status: 'converted' }),
  ]);

  const conversionRate = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(2)) : 0;

  return {
    totalLeads,
    todayLeads,
    monthlyLeads,
    convertedLeads,
    conversionRate,
  };
};

const getLeadsForExport = async ({ requirement, status, search, dateFrom, dateTo, sortBy, sortOrder }) => {
  const query = buildLeadQuery({ requirement, status, search, dateFrom, dateTo });
  const sort = resolveSort(sortBy, sortOrder);

  return Lead.find(query).sort(sort);
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
  getLeadById,
  getLeadStats,
  getLeadsForExport,
  getLeads,
  updateLeadById,
};