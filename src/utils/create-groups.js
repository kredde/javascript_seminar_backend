const shuffle = require('lodash.shuffle');
const { Project, Class } = require('../models');

module.exports.createGroups = async (meeting) => {
  const project = await Project.findById(meeting.project);
  const firstClass = await Class.findById(project.classes[0]).populate('students');
  const secondClass = await Class.findById(project.classes[1]).populate('students');

  if (meeting.groupsAssignment === 'whole_class') {
    return [firstClass.students.concat(secondClass.students)];
  }

  const firstRandomStudents = shuffle(firstClass.students);
  const secondRandomStudents = shuffle(secondClass.students);
  const length = firstRandomStudents.length + secondRandomStudents.length;

  if (!length) {
    return [];
  }

  const groupsAssignments = { tandem: 2, group3: 3, group4: 4 };
  const groups = [];
  let currentGroup = [];
  let i = 0;
  let j = 0;

  while (i + j < length) {
    if ((i + j) % groupsAssignments[meeting.groupsAssignment] === 0 && i + j > 0) {
      groups.push(currentGroup);
      currentGroup = [];
    }

    if (i < firstRandomStudents.length && (i <= j || j >= secondRandomStudents.length)) {
      currentGroup.push(firstRandomStudents[i]);
      i += 1;
    } else {
      currentGroup.push(secondRandomStudents[j]);
      j += 1;
    }
  }

  // if there is just one student in the last group it is added to the previous
  if (currentGroup.length < 2) {
    groups[groups.length - 1] = groups[groups.length - 1].concat(currentGroup);
  } else {
    groups.push(currentGroup);
  }

  return groups;
};
