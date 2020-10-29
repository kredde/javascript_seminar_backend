const express = require('express');
const auth = require('../../middlewares/auth');
const { aliasGame, drawitGame, quizGame, quizQuestion } = require('../../models/game.model');
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
    const games = await quizGame.find();
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
    quizGame.findById(req.params.id, (err, game) => {
      if (err) {
        return res.sendStatus(404);
      }
      if (game == null) return res.sendStatus(404);
      const allquestions = [];
      game.questions.forEach((element) => {
        quizQuestion.findById(element, (err1, qst) => {
          allquestions.push(qst.toJSON());
          if (allquestions.length === game.questions.length) {
            // eslint-disable-next-line
            game.questions = allquestions;
            res.status(200).json(game.toJSON());
          }
        });
      });
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
  quizGame.findById(req.params.id, (err, game) => {
    if (err) {
      return res.sendStatus(404);
    }
    if (game == null) return res.sendStatus(404);
    const allquestions = [];
    game.questions.forEach((element) => {
      quizQuestion.findById(element, (err1, qst) => {
        allquestions.push(qst.toJSON());
        if (allquestions.length === game.questions.length) {
          res.status(200).json(allquestions);
        }
      });
    });
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
router.get('/quiz/questions', auth(), (req, res) => {
  return quizQuestion.find((err, qst) => res.json(qst));
});

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
  quizQuestion.findById(req.params.id, (err, qst) => {
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
  const newQuiz = quizGame.create(req.body);
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
  const newQst = quizQuestion.create(req.body);
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
  quizGame.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description, questions: req.body.questions },
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
  quizQuestion.findByIdAndUpdate(
    req.params.id,
    {
      type: req.body.type,
      name: req.body.name,
      question: req.body.question,
      options: req.body.options,
      answer: req.body.answer
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
  quizGame.deleteOne({ _id: req.params.id }, (err, quiz) => {
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
  quizQuestion.deleteOne({ _id: req.params.id }, (err, qst) => {
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
router.get('/drawit/games', auth(), (req, res) => {
  drawitGame.find((err, games) => res.json(games));
});

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
  drawitGame.findById(req.params.id, (err, game) => {
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
  const newGame = drawitGame.create(req.body);
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
  drawitGame.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description, words: req.body.words },
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
  drawitGame.deleteOne({ _id: req.params.id }, (err, game) => {
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
router.get('/alias/games', auth(), (req, res) => {
  aliasGame.find((err, games) => res.json(games));
});

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
  aliasGame.findById(req.params.id, (err, game) => {
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
  const newGame = aliasGame.create(req.body);
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
  aliasGame.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description, words: req.body.words },
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
  aliasGame.deleteOne({ _id: req.params.id }, (err, game) => {
    if (game == null) return res.sendStatus(404);
    res.sendStatus(200);
  });
});

module.exports = router;
