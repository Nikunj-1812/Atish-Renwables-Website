/**
 * Migration script to seed default projects and team members
 * Run this from backend root: node src/migrations/seedDefaults.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Team = require('../models/Team');
const { defaultProjects, defaultTeamMembers } = require('../utils/defaultData');

const seedDefaults = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/atish_website';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Seed Projects
    console.log('\n📦 Seeding default projects...');
    
    // Check if default projects already exist
    const existingDefaultProjects = await Project.countDocuments({ isDefault: true });
    if (existingDefaultProjects > 0) {
      console.log(`⚠ Found ${existingDefaultProjects} existing default projects. Skipping project seeding to avoid duplicates.`);
    } else {
      const insertedProjects = await Project.insertMany(defaultProjects);
      console.log(`✓ Successfully inserted ${insertedProjects.length} default projects`);
    }

    // Seed Team Members
    console.log('\n👥 Seeding default team members...');
    
    // Check if default team members already exist
    const existingDefaultTeam = await Team.countDocuments({ isDefault: true });
    if (existingDefaultTeam > 0) {
      console.log(`⚠ Found ${existingDefaultTeam} existing default team members. Skipping team seeding to avoid duplicates.`);
    } else {
      const insertedTeam = await Team.insertMany(defaultTeamMembers);
      console.log(`✓ Successfully inserted ${insertedTeam.length} default team members`);
    }

    console.log('\n✓ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
};

seedDefaults();
