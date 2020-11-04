const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const aliasSchema = new mongoose.Schema({
  name: String,
  description: String,
  words: Object,
  teacher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  duration: Number,
  versionKey: false
});
aliasSchema.plugin(toJSON);

const drawitSchema = new mongoose.Schema({
  name: String,
  description: String,
  words: Object,
  teacher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  duration: Number,
  versionKey: false
});
drawitSchema.plugin(toJSON);

const quizSchema = new mongoose.Schema({
  name: String,
  description: String,
  questions: Object,
  teacher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  duration: Number
});
quizSchema.plugin(toJSON);

const questionSchema = new mongoose.Schema({
  type: String,
  name: String,
  question: String,
  options: Object,
  answer: Object,
  teacher: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }
});
questionSchema.plugin(toJSON);

const AliasGame = mongoose.model('Alias', aliasSchema);
const DrawitGame = mongoose.model('DrawIt', drawitSchema);
const QuizGame = mongoose.model('QuizGame', quizSchema);
const QuizQuestion = mongoose.model('QuizQuestion', questionSchema);

module.exports = {
  AliasGame,
  DrawitGame,
  QuizGame,
  QuizQuestion
};
