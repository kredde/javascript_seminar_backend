const { School } = require('../models');

const createSchool = async (schoolBody) => {
  const school = await School.create(schoolBody);
  return school;
};

const getSchools = async (subs) => {
  return School.find({ name: { $regex: subs } });
};

const getSchoolById = async (schoolId) => {
  return School.findOne({ _id: schoolId });
};

module.exports = {
  createSchool,
  getSchools,
  getSchoolById
};
