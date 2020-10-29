const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const aliasSchema = new mongoose.Schema({
  name: String,
  description: String,
  words: Object,
  versionKey: false
});
aliasSchema.plugin(toJSON);

const drawitSchema = new mongoose.Schema({
  name: String,
  description: String,
  words: Object,
  versionKey: false
});
drawitSchema.plugin(toJSON);

const quizSchema = new mongoose.Schema({
  name: String,
  description: String,
  questions: Object
});
quizSchema.plugin(toJSON);

const questionSchema = new mongoose.Schema({
  type: String,
  name: String,
  question: String,
  options: Object,
  answer: Object
});
questionSchema.plugin(toJSON);

const aliasGame = mongoose.model('Alias', aliasSchema);
const drawitGame = mongoose.model('DrawIt', drawitSchema);
const quizGame = mongoose.model('QuizGame', quizSchema);
const quizQuestion = mongoose.model('QuizQuestion', questionSchema);

module.exports = {
  aliasGame,
  drawitGame,
  quizGame,
  quizQuestion
};
