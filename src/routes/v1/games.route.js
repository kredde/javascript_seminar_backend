const express = require('express');
const auth = require('../../middlewares/auth');
const { AliasGame, DrawitGame, QuizGame, QuizQuestion } = require('../../models/game.model');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Gaming backend routes
 */

/**
 * @swagger
 * path:
 *  /games/quiz/quizzes:
 *    get:
 *      summary: Get quizzes
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get(
  '/quiz/quizzes',
  auth(),
  catchAsync(async (req, res) => {
    const games = await QuizGame.find({ teacher: req.user.id });
    res.json(games);
  })
);

/**
 * @swagger
 * path:
 *  /games/quiz/quizzes/{quizId}:
 *    get:
 *      summary: Get quiz
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get(
  '/quiz/quizzes/:id',
  auth(),
  catchAsync(async (req, res) => {
    QuizGame.findById(req.params.id, (err, game) => {
      if (err) {
        return res.sendStatus(404);
      }
      if (game == null) return res.sendStatus(404);
      const allquestions = [];
      (game.questions || []).forEach((element) => {
        QuizQuestion.findById(element, (err1, qst) => {
          allquestions.push(qst.toJSON());
        });
      });
      // eslint-disable-next-line
      game.questions = allquestions;
      res.status(200).json(game.toJSON());
    });
  })
);

/**
 * @swagger
 * path:
 *  /games/quiz/quizzes/{quizId}/questions:
 *    get:
 *      summary: Get questions
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get('/quiz/quizzes/:id/questions', auth(), (req, res) => {
  QuizGame.findById(req.params.id, (err, game) => {
    if (err) {
      return res.sendStatus(404);
    }
    if (game == null) return res.sendStatus(404);
    const allquestions = [];
    (game.questions || []).forEach((element) => {
      QuizQuestion.findById(element, (err1, qst) => {
        allquestions.push(qst.toJSON());
      });
    });
    res.status(200).json(allquestions);
  });
});

/**
 * @swagger
 * path:
 *  /games/quiz/questions:
 *    get:
 *      summary: Get questions
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get(
  '/quiz/questions',
  auth(),
  catchAsync(async (req, res) => {
    const questions = await QuizQuestion.find({ teacher: req.user.id });
    res.json(questions);
  })
);

/**
 * @swagger
 * path:
 *  /games/quiz/question/{questionId}:
 *    get:
 *      summary: Get question
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get('/quiz/question/:id', auth(), (req, res) => {
  QuizQuestion.findById(req.params.id, (err, qst) => {
    if (err || qst == null) {
      return res.sendStatus(404);
    }
    res.json(qst.toJSON());
  });
});

/**
 * @swagger
 * path:
 *  /games/quiz/create:
 *    post:
 *      summary: Create quiz
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.post('/quiz/create', auth(), (req, res) => {
  let quiz = req.body;
  quiz.teacher = req.user.id;
  const newQuiz = new QuizGame(quiz);
  newQuiz.save((err, qz) => {
    if (err) {
      return res.sendStatus(500);
    }
    res.status(200).json(qz.toJSON());
  });
});

/**
 * @swagger
 * path:
 *  /games/quiz/create/question/create:
 *    post:
 *      summary: Create quiz
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.post('/quiz/question/create', auth(), (req, res) => {
  let question = req.body;
  question.teacher = req.user.id;
  const newQst = new QuizQuestion(question);
  newQst.save((err, qst) => {
    if (err) {
      return res.sendStatus(500);
    }
    res.status(200).json(qst.toJSON());
  });
});

/**
 * @swagger
 * path:
 *  /games/quiz/{quizId}:
 *    put:
 *      summary: Update quiz
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.put('/quiz/:id', auth(), (req, res) => {
  QuizGame.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description, questions: req.body.questions, teacher: req.user.id, duration: req.body.duration },
    { new: true },
    (err, game) => {
      if (err || game == null) {
        return res.sendStatus(404);
      }
      res.json(game.toJSON());
    }
  );
});

/**
 * @swagger
 * path:
 *  /games/quiz/question/{questionId}:
 *    get:
 *      summary: Update question
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.put('/quiz/question/:id', auth(), (req, res) => {
  QuizQuestion.findByIdAndUpdate(
    req.params.id,
    {
      type: req.body.type,
      name: req.body.name,
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer,
      teacher: req.user.id
    },
    { new: true },
    (err, qst) => {
      if (err || qst == null) {
        return res.sendStatus(404);
      }
      res.json(qst.toJSON());
    }
  );
});

/**
 * @swagger
 * path:
 *  /games/quiz/{quizId}:
 *    delete:
 *      summary: Delete quiz
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.delete('/quiz/:id', auth(), (req, res) => {
  QuizGame.deleteOne({ _id: req.params.id }, (err, quiz) => {
    if (err) {
      res.sendStatus(404);
    }
    if (quiz == null) return res.sendStatus(404);
    res.sendStatus(200);
  });
});

/**
 * @swagger
 * path:
 *  /games/quiz/question/{questionId}:
 *    delete:
 *      summary: Delete question
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.delete('/quiz/question/:id', auth(), (req, res) => {
  QuizQuestion.deleteOne({ _id: req.params.id }, (err, qst) => {
    if (err) {
      res.sendStatus(404);
    } else {
      if (qst == null) return res.sendStatus(404);
      res.sendStatus(200);
    }
  });
});

/**
 * @swagger
 * path:
 *  /games/drawit/games:
 *    get:
 *      summary: Get drawit games
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get(
  '/drawit/games',
  auth(),
  catchAsync(async (req, res) => {
    const games = await DrawitGame.find({ teacher: req.user.id });
    res.json(games);
  })
);

/**
 * @swagger
 * path:
 *  /games/drawit/{drawitId}:
 *    get:
 *      summary: get drawit game
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get('/drawit/:id', (req, res) => {
  DrawitGame.findById(req.params.id, (err, game) => {
    if (err || game == null) {
      return res.sendStatus(404);
    }
    res.json(game.toJSON());
  });
});

/**
 * @swagger
 * path:
 *  /games/drawit/create:
 *    post:
 *      summary: Create drawit
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.post('/drawit/create', auth(), (req, res) => {
  let game = req.body;
  game.teacher = req.user.id;
  const newGame = new DrawitGame(game);
  newGame.save((err, _newGame) => {
    if (err || _newGame == null) {
      res.sendStatus();
    } else {
      res.status(200).json(_newGame.toJSON());
    }
  });
});

/**
 * @swagger
 * path:
 *  /games/drawit/{drawitId}:
 *    put:
 *      summary: Update drawit
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.put('/drawit/:id', auth(), (req, res) => {
  DrawitGame.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description, words: req.body.words, teacher: req.user.id, duration: req.body.duration },
    { new: true },
    (err, game) => {
      if (err || game == null) {
        return res.sendStatus(404);
      }
      res.json(game.toJSON());
    }
  );
});

/**
 * @swagger
 * path:
 *  /games/drawit/{drawitId}:
 *    delete:
 *      summary: Delete drawit
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.delete('/drawit/:id', auth(), (req, res) => {
  DrawitGame.deleteOne({ _id: req.params.id }, (err, game) => {
    if (err) {
      res.sendStatus(404);
    }
    if (game == null) return res.sendStatus(404);
    res.sendStatus(200);
  });
});

/**
 * @swagger
 * path:
 *  /games/alias/games:
 *    get:
 *      summary: Get aliasses
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get(
  '/alias/games',
  auth(),
  catchAsync(async (req, res) => {
    const games = await AliasGame.find({ teacher: req.user.id });
    res.json(games);
  })
);

/**
 * @swagger
 * path:
 *  /games/alias/{aliasId}:
 *    get:
 *      summary: Get alias
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.get('/alias/:id', (req, res) => {
  AliasGame.findById(req.params.id, (err, game) => {
    if (err || game == null) {
      return res.sendStatus(404);
    }
    res.json(game.toJSON());
  });
});

/**
 * @swagger
 * path:
 *  /games/alias/create:
 *    post:
 *      summary: Create alias
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.post('/alias/create', auth(), (req, res) => {
  let game = req.body;
  game.teacher = req.user.id;
  const newGame = new AliasGame(game);
  newGame.save((err, _newGame) => {
    res.status(200).json(_newGame.toJSON());
  });
});

/**
 * @swagger
 * path:
 *  /games/alias/{aliasId}:
 *    put:
 *      summary: Update alias
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.put('/alias/:id', auth(), (req, res) => {
  AliasGame.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description, words: req.body.words, teacher: req.user.id, duration: req.body.duration },
    (err, game) => {
      if (game == null) return res.sendStatus(404);
      res.sendStatus(200);
    }
  );
});

/**
 * @swagger
 * path:
 *  /games/alias/{aliasId}:
 *    delete:
 *      summary: Delete alias
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 */
router.delete('/alias/:id', auth(), (req, res) => {
  AliasGame.deleteOne({ _id: req.params.id }, (err, game) => {
    if (game == null) return res.sendStatus(404);
    res.sendStatus(200);
  });
});

module.exports = router;
