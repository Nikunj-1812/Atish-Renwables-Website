const Project = require('../models/Project');

const buildProjectQuery = ({ search, category, megaProject } = {}) => {
  const query = {};

  if (search) {
    query.$or = [
      { projectName: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { district: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    query.category = String(category).trim();
  }

  if (megaProject === true || megaProject === 'true') {
    query.isMegaProject = true;
  }

  return query;
};

const listProjects = async (filters = {}) => {
  const query = buildProjectQuery(filters);
  const projects = await Project.find(query).sort({ isMegaProject: -1, createdAt: -1 });
  return projects;
};

const getProjectById = async (id) => {
  return Project.findById(id);
};

const createProject = async (payload) => {
  return Project.create(payload);
};

const updateProject = async (id, payload) => {
  return Project.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const deleteProject = async (id) => {
  return Project.findByIdAndDelete(id);
};

module.exports = {
  createProject,
  deleteProject,
  getProjectById,
  listProjects,
  updateProject,
};