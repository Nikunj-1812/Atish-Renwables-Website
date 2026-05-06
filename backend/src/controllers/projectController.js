const {
  createProject: createProjectRecord,
  deleteProject: deleteProjectRecord,
  getProjectById,
  listProjects,
  updateProject: updateProjectRecord,
} = require('../services/projectService');
const { isValidObjectId, validateProjectPayload } = require('../utils/requestValidators');
const { sendError, sendSuccess } = require('../utils/apiResponse');

const normalizeProject = (project) => ({
  _id: project._id,
  projectName: project.projectName,
  imageUrl: project.imageUrl,
  location: project.location,
  city: project.city,
  district: project.district,
  category: project.category,
  systemSizeKw: project.systemSizeKw,
  description: project.description,
  caseStudy: project.caseStudy || '',
  isMegaProject: Boolean(project.isMegaProject),
  isDefault: Boolean(project.isDefault),
  createdAt: project.createdAt,
});

const getProjects = async (req, res) => {
  try {
    const projects = await listProjects({
      search: req.query.search,
      category: req.query.category,
      megaProject: req.query.megaProject,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Projects fetched successfully.',
      data: {
        projects: projects.map(normalizeProject),
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to fetch projects.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid project id.',
      });
    }

    const project = await getProjectById(id);

    if (!project) {
      return sendError(res, {
        statusCode: 404,
        message: 'Project not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Project fetched successfully.',
      data: normalizeProject(project),
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to fetch project.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const createProject = async (req, res) => {
  try {
    const errors = validateProjectPayload(req.body, { requireImageUrl: true });
    if (errors.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid project payload.',
        errors,
      });
    }

    const project = await createProjectRecord({
      ...req.body,
      systemSizeKw: Number(req.body.systemSizeKw),
      isMegaProject: req.body.isMegaProject === true || req.body.isMegaProject === 'true',
      caseStudy: req.body.caseStudy || '',
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Project created successfully.',
      data: normalizeProject(project),
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to create project.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid project id.',
      });
    }

    const errors = validateProjectPayload(req.body, { requireImageUrl: false });
    if (errors.length > 0) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid project payload.',
        errors,
      });
    }

    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return sendError(res, {
        statusCode: 404,
        message: 'Project not found.',
      });
    }

    const nextImageUrl = req.body.imageUrl || existingProject.imageUrl;

    const updatedProject = await updateProjectRecord(id, {
      ...req.body,
      imageUrl: nextImageUrl,
      systemSizeKw: req.body.systemSizeKw !== undefined ? Number(req.body.systemSizeKw) : existingProject.systemSizeKw,
      isMegaProject: req.body.isMegaProject !== undefined
        ? req.body.isMegaProject === true || req.body.isMegaProject === 'true'
        : existingProject.isMegaProject,
      caseStudy: req.body.caseStudy !== undefined ? req.body.caseStudy : existingProject.caseStudy,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Project updated successfully.',
      data: normalizeProject(updatedProject),
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to update project.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid project id.',
      });
    }

    const deletedProject = await deleteProjectRecord(id);

    if (!deletedProject) {
      return sendError(res, {
        statusCode: 404,
        message: 'Project not found.',
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Project deleted successfully.',
      data: { deleted: true },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to delete project.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

module.exports = {
  createProject,
  deleteProject,
  getProjectDetail,
  getProjects,
  updateProject,
};