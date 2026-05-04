const { validateRequirementFilter } = require('../utils/requestValidators');
const {
  getLeads,
  getLeadById,
  getLeadStats,
  updateLeadById,
  deleteLeadById,
  getLeadsForExport,
} = require('../services/leadService');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const getAllLeads = async (req, res) => {
  try {
    const {
      requirement,
      status,
      search,
      dateFrom,
      dateTo,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;
    const invalidRequirements = validateRequirementFilter(requirement);

    if (invalidRequirements) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid requirement filter.',
        errors: invalidRequirements,
      });
    }

    const { leads, pagination } = await getLeads({
      requirement,
      status,
      search,
      dateFrom,
      dateTo,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Leads fetched successfully',
      data: {
        count: leads.length,
        pagination,
        leads,
      },
      errors: [],
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to fetch leads.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const getLeadDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await getLeadById({ id });

    if (!lead) {
      return sendError(res, {
        statusCode: 404,
        message: 'Lead not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Lead fetched successfully',
      data: lead,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to fetch lead details.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const getLeadDashboardStats = async (req, res) => {
  try {
    const stats = await getLeadStats();

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Lead dashboard stats fetched successfully',
      data: stats,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to fetch lead stats.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const updatedLead = await updateLeadById({ id, status, notes });

    if (!updatedLead) {
      return sendError(res, {
        statusCode: 404,
        message: 'Lead not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to update lead status.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLead = await deleteLeadById({ id });

    if (!deletedLead) {
      return sendError(res, {
        statusCode: 404,
        message: 'Lead not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Lead deleted successfully',
      data: deletedLead,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to delete lead.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const exportLeads = async (req, res) => {
  try {
    const { requirement, status, search, dateFrom, dateTo, sortBy, sortOrder } = req.query;
    const leads = await getLeadsForExport({
      requirement,
      status,
      search,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    });

    const headers = [
      'Name',
      'Phone',
      'Email',
      'City',
      'Requirement',
      'Monthly Bill',
      'Status',
      'Notes',
      'Date',
    ];

    const rows = leads.map((lead) => [
      lead.name,
      lead.phone,
      lead.email,
      lead.city,
      lead.requirement,
      lead.monthlyBill ?? '',
      lead.status,
      lead.notes || '',
      lead.createdAt ? new Date(lead.createdAt).toISOString() : '',
    ]);

    const toCsvCell = (value) => {
      const stringValue = String(value ?? '');
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
    return res.status(200).send(csv);
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return sendError(res, {
      statusCode,
      message: error.message || 'Failed to export leads.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

module.exports = {
  exportLeads,
  getAllLeads,
  getLeadDashboardStats,
  getLeadDetail,
  deleteLead,
  updateLead,
};