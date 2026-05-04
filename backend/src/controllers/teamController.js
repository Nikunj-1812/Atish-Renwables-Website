const {
  createTeamMember: createTeamMemberRecord,
  deleteTeamMember: deleteTeamMemberRecord,
  getTeamMemberById,
  listTeamMembers,
  updateTeamMember: updateTeamMemberRecord,
} = require('../services/teamService');
const { isValidObjectId, validateTeamPayload } = require('../utils/requestValidators');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const normalizeTeamMember = (member) => ({
  _id: member._id,
  name: member.name,
  role: member.role,
  imageUrl: member.imageUrl,
  virtualCardLink: member.virtualCardLink || '',
  createdAt: member.createdAt,
});

const getTeam = async (req, res) => {
  try {
    const teamMembers = await listTeamMembers({ search: req.query.search });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Team fetched successfully.',
      data: {
        teamMembers: teamMembers.map(normalizeTeamMember),
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to fetch team.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const getTeamDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid team member id.',
      });
    }

    const member = await getTeamMemberById(id);

    if (!member) {
      return sendError(res, {
        statusCode: 404,
        message: 'Team member not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Team member fetched successfully.',
      data: normalizeTeamMember(member),
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to fetch team member.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const createTeamMember = async (req, res) => {
  try {
    const errors = validateTeamPayload(req.body, { requireImageUrl: true });
    if (errors.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid team payload.',
        errors,
      });
    }

    const member = await createTeamMemberRecord({
      ...req.body,
      virtualCardLink: req.body.virtualCardLink || '',
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Team member created successfully.',
      data: normalizeTeamMember(member),
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to create team member.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid team member id.',
      });
    }

    const errors = validateTeamPayload(req.body, { requireImageUrl: false });
    if (errors.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid team payload.',
        errors,
      });
    }

    const existingMember = await getTeamMemberById(id);
    if (!existingMember) {
      return sendError(res, {
        statusCode: 404,
        message: 'Team member not found.',
      });
    }

    const updatedMember = await updateTeamMemberRecord(id, {
      ...req.body,
      imageUrl: req.body.imageUrl || existingMember.imageUrl,
      virtualCardLink: req.body.virtualCardLink !== undefined ? req.body.virtualCardLink : existingMember.virtualCardLink,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Team member updated successfully.',
      data: normalizeTeamMember(updatedMember),
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to update team member.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid team member id.',
      });
    }

    const deletedMember = await deleteTeamMemberRecord(id);

    if (!deletedMember) {
      return sendError(res, {
        statusCode: 404,
        message: 'Team member not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Team member deleted successfully.',
      data: { deleted: true },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to delete team member.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

module.exports = {
  createTeamMember,
  deleteTeamMember,
  getTeam,
  getTeamDetail,
  updateTeamMember,
};