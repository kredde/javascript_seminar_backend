const { School } = require('../models');

const createSchool = async (schoolBody) => {
  const school = await School.create(schoolBody);
  return school;
};

const getSchools = async (name) => {
  if (!name || name.length === 0) {
    return School.find({ name: { $regex: name } });
  }
};

const getSchoolById = async (schoolId) => {
  return School.findOne({ _id: schoolId });
};

module.exports = {
  createSchool,
  getSchools,
  getSchoolById
};
