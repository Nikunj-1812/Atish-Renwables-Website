const Team = require('../models/Team');

const buildTeamQuery = ({ search } = {}) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  return query;
};

const listTeamMembers = async (filters = {}) => {
  const query = buildTeamQuery(filters);
  return Team.find(query).sort({ createdAt: -1 });
};

const getTeamMemberById = async (id) => {
  return Team.findById(id);
};

const createTeamMember = async (payload) => {
  return Team.create(payload);
};

const updateTeamMember = async (id, payload) => {
  return Team.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
};

const deleteTeamMember = async (id) => {
  return Team.findByIdAndDelete(id);
};

module.exports = {
  createTeamMember,
  deleteTeamMember,
  getTeamMemberById,
  listTeamMembers,
  updateTeamMember,
};