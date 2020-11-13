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
 *      description: Get all quizzes created by a teacher
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200": 
 *          description: all available games
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/QuizGames'
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
 *      description: Get quiz with that id including questions
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of quiz
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the quiz 
 *          schema: 
 *            $ref: '#/components/schemas/FullQuizGame'
 *         "404": 
 *            description: no game with that id 
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
 *      summary: Get questions for a quiz
 *      desctiption: Get all questions for quiz with the id
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of quiz
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: Questions
 *          schema: 
 *            type: array
 *             items:
 *                $ref: '#/components/schemas/QuizQuestion'
 *        "404": 
 *          description: No quiz with that id
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
 *      summary: Get all questions
 *      desctiption: Get all questions created by a teacher
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200": 
 *          description: Questions
 *          schema: 
 *            type: array
 *             items:
 *                $ref: '#/components/schemas/QuizQuestion'
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
 *      desctiption: get question with that id
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of question
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the question 
 *          schema: 
 *            $ref: '#/components/schemas/QuizQuestion'
 *        "404": 
 *          description: no question with that id 
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
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                questions:
 *                  type: object
 *                duration:
 *                  type: number
 *      responses:
 *        "200": 
 *          description: the quiz was created 
 *          schema: 
 *            $ref: '#/components/schemas/QuizGame'
 *        "500": 
 *          description: could not create quiz              
 */
router.post('/quiz/create', auth(), (req, res) => {
  const quiz = req.body;
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
 *      summary: Create quiz question
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                type:
 *                  type: string
 *                name:
 *                  type: string
 *                question:
 *                  type: string
 *                options:
 *                  type: object
 *                answer:
 *                  type: object
 *      responses:
 *        "200": 
 *          description: the question was created 
 *          schema: 
 *            $ref: '#/components/schemas/QuizQuestion'
 *        "500": 
 *          description: could not create question           
 */
router.post('/quiz/question/create', auth(), (req, res) => {
  const question = req.body;
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
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of quiz
 *         required: true
 *         type: string  
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QuizGame'
 *      responses:
 *        "200": 
 *          description: the quiz was updated 
 *          schema: 
 *            $ref: '#/components/schemas/QuizGame'
 *        "404": 
 *          description: could not update quiz
 */
router.put('/quiz/:id', auth(), (req, res) => {
  QuizGame.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      questions: req.body.questions,
      teacher: req.user.id,
      duration: req.body.duration
    },
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
 *    put:
 *      summary: Update question
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of question
 *         required: true
 *         type: string  
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/QuizQuestion'
 *      responses:
 *        "200": 
 *          description: the question was updated 
 *          schema: 
 *            $ref: '#/components/schemas/QuizQuestion'
 *        "404": 
 *          description: could not update question
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
 *      description: delete question with specified id
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of question
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the quiz deleted successfully
 *        "404": 
 *           description: no quiz with that id 
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
 *      description: delete question with specified id
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of question
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the question deleted successfully
 *        "404": 
 *           description: no question with that id 
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
 *      description: Get all draw it games created by a teacher
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200": 
 *          description: all available games
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/DrawItGames'
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
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of game
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the game 
 *          schema: 
 *            $ref: '#/components/schemas/DrawItGame'
 *        "404": 
 *           description: no game with that id 
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
 *      summary: Create drawit game
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                words:
 *                  type: object
 *                duration:
 *                  type: number
 *      responses:
 *        "200": 
 *          description: the game was created 
 *          schema: 
 *            $ref: '#/components/schemas/DrawItGame'
 *        "500": 
 *          description: could not create game       
 */
router.post('/drawit/create', auth(), (req, res) => {
  const game = req.body;
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
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of game
 *         required: true
 *         type: string  
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DrawItGame'
 *      responses:
 *        "200": 
 *          description: the game was updated 
 *          schema: 
 *            $ref: '#/components/schemas/DrawItGame'
 *        "404": 
 *          description: could not update game
 */
router.put('/drawit/:id', auth(), (req, res) => {
  DrawitGame.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      words: req.body.words,
      teacher: req.user.id,
      duration: req.body.duration
    },
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
 *      summary: Delete drawit game
 *      description: Delete game with that id
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of game
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the game deleted successfully
 *        "404": 
 *           description: no game with that id 
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
 *      summary: Get alias games
 *      description: get all alias games created by a teacher
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200": 
 *          description: all available games
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/AliasGames'
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
 *      description: Get alias game with specified id
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of game
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the game 
 *          schema: 
 *            $ref: '#/components/schemas/AliasGame'
 *        "404": 
 *           description: no game with that id 
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
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                words:
 *                  type: object
 *                duration:
 *                  type: number
 *      responses:
 *        "200": 
 *          description: the game was created 
 *          schema: 
 *            $ref: '#/components/schemas/AliasGame'
 *        "500": 
 *          description: could not create game
 */
router.post('/alias/create', auth(), (req, res) => {
  const game = req.body;
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
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of game
 *         required: true
 *         type: string  
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AliasGame'
 *      responses:
 *        "200": 
 *          description: the game was updated 
 *          schema: 
 *            $ref: '#/components/schemas/AliasGame'
 *        "404": 
 *          description: could not update game
 */
router.put('/alias/:id', auth(), (req, res) => {
  AliasGame.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      words: req.body.words,
      teacher: req.user.id,
      duration: req.body.duration
    },
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
 *      description: delete alias game with that id
 *      tags: [Games]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *       - in: path
 *         name: id
 *         description: pass id of game
 *         required: true
 *         type: string  
 *      responses:
 *        "200": 
 *          description: the game deleted successfully
 *        "404": 
 *           description: no game with that id 
 */
router.delete('/alias/:id', auth(), (req, res) => {
  AliasGame.deleteOne({ _id: req.params.id }, (err, game) => {
    if (game == null) return res.sendStatus(404);
    res.sendStatus(200);
  });
});

module.exports = router;
