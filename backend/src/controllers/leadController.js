const { validateRequirementFilter } = require('../utils/requestValidators');
const { getLeads, updateLeadStatusById, deleteLeadById } = require('../services/leadService');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const getAllLeads = async (req, res) => {
  try {
    const { requirement } = req.query;
    const invalidRequirements = validateRequirementFilter(requirement);

    if (invalidRequirements) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid requirement filter.',
        errors: invalidRequirements,
      });
    }

    const leads = await getLeads({ requirement });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Leads fetched successfully',
      data: {
        count: leads.length,
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

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedLead = await updateLeadStatusById({ id, status });

    if (!updatedLead) {
      return sendError(res, {
        statusCode: 404,
        message: 'Lead not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Lead status updated successfully',
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

module.exports = {
  getAllLeads,
  deleteLead,
  updateLeadStatus,
};