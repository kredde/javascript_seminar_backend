const roles = ['teacher', 'student'];

/**
 * the rights of the teachers and students are defined here
 */
const roleRights = new Map();
roleRights.set(roles[0], []);
roleRights.set(roles[1], []);

module.exports = {
  roles,
  roleRights
};
