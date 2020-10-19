const catchAsync = require('../utils/catchAsync');
const { ISO_LANGUAGES, SUBJECTS, ISO_COUNTRIES } = require('../utils/constants');

const getLanguages = catchAsync(async (_, res) => {
  const languages = Object.keys(ISO_LANGUAGES).map((key) => ({ name: ISO_LANGUAGES[key].name, value: key }));

  res.send(languages);
});

const getSubjects = catchAsync(async (_, res) => {
  const subjects = Object.keys(SUBJECTS).map((key) => ({ name: SUBJECTS[key].name, value: key }));

  res.send(subjects);
});

const getCountries = catchAsync(async (_, res) => {
  res.send(ISO_COUNTRIES);
});

module.exports = {
  getLanguages,
  getSubjects,
  getCountries
};
