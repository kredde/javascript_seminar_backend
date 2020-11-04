/* eslint-disable */
const fetch = require('node-fetch');
const config = require('../config/config');

// Map <SessionId, GameState>
let openSessions = new Map();
let io;

let url = config.backendHost;

module.exports = {
  gameInit: function (ioServer) {
    console.log('Creating Games socket');
    //create a io socket
    io = ioServer;
    // io = socket(server);
    const connectedUsers = new Set(); //a list of every connection to the socket
    io.on('connection', function (socket) {
      console.log('Made socket connection');

      // Defines Signals to react to
      socket.on('connect', (data) => {
        console.log('Client Connected: ' + data);
      });

      socket.on('disconnect', (data) => {
        //console.log('Disconnecting', data, socket);
        connectedUsers.delete(socket.userId);
      });

      socket.on('joinGame', (data) => {
        handleJoinGameMessage(data, socket);
      });

      socket.on('updateGame', (data) => {
        handleUpdateGameMessage(data);
      });
    });
  }
};

async function handleJoinGameMessage(data, socket) {
  // Join Room that will be subscribed
  socket.join(data.sessionId);

  if (openSessions.get(data.sessionId) == undefined) {
    // Create new Session

    console.log('Create new Session for ' + data.playerName);
    let currentGame = await createSession(data.sessionId, data.gameType, data.playerName, data.taskId);
    openSessions.set(data.sessionId, currentGame);

    io.to(data.sessionId).emit('updateGame', currentGame);
  } else {
    // use existing Session
    console.log('Existing Session!' + openSessions.get(data.sessionId));

    // Update Gamesession
    let currentGame = openSessions.get(data.sessionId);
    currentGame.players.push(data.playerName);

    // TODO further update Details

    // Send new State in Room to every listener
    io.to(data.sessionId).emit('updateGame', openSessions.get(data.sessionId));
  }
}

function createSession(sessionId, gameType, playerName, taskId) {
  if (gameType == 'alias') {
    return createAliasSession(sessionId, gameType, playerName, taskId);
  } else if (gameType == 'drawit') {
    return createDrawItSession(sessionId, gameType, playerName, taskId);
  } else if (gameType == 'quiz') {
    return createQuizSession(sessionId, gameType, playerName, taskId);
  } else if (gameType == 'truthlie') {
    return createTruthlieSession(sessionId, gameType, playerName, taskId);
  }
}

async function createQuizSession(sessionId, gameType, playerName, taskId) {
  let session = {
    gameType: gameType,
    sessionId: sessionId,
    players: [playerName],
    quizes: [],
    state: 'lobby',
    quizIndex: 0,
    getSolution: false,
    countDownStarted: false,
    quizOver: false,
    taskId: taskId
  };
  return session;
}

async function createAliasSession(sessionId, gameType, playerName, taskId) {
  let session = {
    gameType: gameType,
    sessionId: sessionId,
    players: [playerName],
    currentPlayer: playerName,
    numberOfGuessedWords: 0,
    countDownStarted: false,
    words: [],
    name: '',
    description: '',
    taskId: taskId,
    state: 'lobby',
    timeleft: 120
  };
  try {
    let alias = await getAliasGame(taskId);
    session.words = alias.words;
    session.name = alias.name;
    session.description = alias.description;
    session.timeleft = alias.duration;
    return session;
  } catch (error) {
    console.log('could not get alias game');
    return null;
  }
}

async function createTruthlieSession(sessionId, gameType, playerName, taskId) {
  let session = {
    gameType: gameType,
    sessionId: sessionId,
    players: [playerName],
    played: [],
    currentPlayer: playerName, // The playername of the currently in charge player
    countDownStarted: false, // indicates if countdown started, a change starts countdown for all clients
    options: [],
    guessed: [],
    lie: '', // False statement
    name: '', // name of the game
    state: 'lobby',
    timelimit: 15,
    timeleft: 15,
    next: true
  };
  return session;
}

async function createDrawItSession(sessionId, gameType, playerName, taskId) {
  let session = {
    gameType: gameType,
    sessionId: sessionId,
    players: [playerName],
    currentPlayer: playerName,
    numberOfGuessedWords: 0,
    countDownStarted: false,
    words: [],
    name: '',
    description: '',
    taskId: taskId,
    state: 'lobby',
    timeleft: 120,
    drawing: null
  };
  try {
    let drawit = await getDrawItGame(taskId);
    session.words = alias.words;
    session.name = alias.name;
    session.description = drawit.description;
    session.timeleft = drawit.duration;
    return session;
  } catch (error) {
    console.log('could not get drawit game');
    return null;
  }
}

async function getAliasGame(taskId) {
  let hex = /[0-9A-Fa-f]{6}/g;
  if (taskId == '' || taskId == null || taskId == undefined || !hex.test(taskId)) {
    // Get random words
    console.log('Wrong taskID, get random words'); // TODO -> throw and handle error!
    return {
      id: taskId,
      name: 'Mock Alias Game',
      description: 'this is not a real game',
      words: ['Banana', 'Trump', 'Bicycle', 'Pluto'],
      duration: 45
    };
  } else {
    // Find by ID
    try {
      let alias = fetch(url + '/games/alias/' + taskId).then((res) => res.json());
      return alias;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

async function getDrawItGame(taskId) {
  let hex = /[0-9A-Fa-f]{6}/g;
  if (taskId == '' || taskId == null || taskId == undefined || !hex.test(taskId)) {
    // Get random words
    console.log('Wrong taskID, get random words'); // TODO -> throw and handle error!
    return {
      id: taskId,
      name: 'Mock Draw It Game',
      description: 'this is not a real game',
      words: ['Banana', 'Trump', 'Bicycle', 'Pluto'],
      duration: 45
    };
  } else {
    // Find by ID
    try {
      let drawit = fetch(url + '/games/drawit/' + taskId).then((res) => res.json());
      return drawit;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

// Send Update to every participant
async function handleUpdateGameMessage(data) {
  // Remove session data if nobody is connected
  if (data.players.length == 0) {
    openSessions.set(data.sessionId, undefined);
    console.log('Closing session: ' + data.sessionId);
    return;
  }
  if (data.gameType == 'alias') {
    await handleAliasUpdateMessage(data);
  } else if (data.gameType == 'drawit') {
    await handleDrawItUpdateMessage(data);
  } else if (data.gameType == 'quiz') {
    await handleQuizUpdateMessage(data);
  } else if (data.gameType == 'truthlie') {
    await handleTruthlieUpdateMessage(data);
  } else {
    console.log('Unknown gameType: ' + data.gameType);
  }
}

async function handleAliasUpdateMessage(data) {
  io.to(data.sessionId).emit('updateGame', data);
  openSessions.set(data.sessionId, data);
}

async function handleDrawItUpdateMessage(data) {
  io.to(data.sessionId).emit('updateGame', data);
  openSessions.set(data.sessionId, data);
}

async function handleTruthlieUpdateMessage(data) {
  io.to(data.sessionId).emit('updateGame', data);
  openSessions.set(data.sessionId, data);
}

function handleQuizUpdateMessage(data) {
  // Get new Questions!
  if (data.countDownStarted == true && data.quizes.length == 0) {
    let taskId;
    let hex = /[0-9A-Fa-f]{6}/g;
    if (data.taskId == null || data.taskId == undefined || data.taskId == '' || !hex.test(data.taskId)) {
      console.log('Invalid Task ID, sending mock quiz');
      let quiz = { id: taskId, name: "This is a mock quiz!", description: "The Quiz you were looking for could not be found...", questions: [] };
      let q = {
        question: "What's the matching translation?",
        answers: ["tree", "Baum", "Katze", "cat", "Game", "Spiel"],
        correctAnswers: [[0, 1], [2, 3], [4, 5]],
        selectedAnswers: [],
        type: "match",
        leftAnswers: ["tree", "Baum", "Katze", "cat", "Game", "Spiel"],
        rightAnswers: []
      };
      data.quizes.push(q);
      let q2 = {
        question: "When did World War 2 end?",
        answers: ["2. September 1945", "3.September 1939", "30. June 1944", "5. January 1945"],
        correctAnswers: [0],
        selectedAnswers: [],
        type: "select",
        leftAnswers: ["2. September 1945", "3.September 1939", "30. June 1944", "5. January 1945"],
        rightAnswers: []
      }
      data.quizes.push(q2);
      io.to(data.sessionId).emit('updateGame', data);
      openSessions.set(data.sessionId, data);
    } else {
      taskId = data.taskId;
      fetch(url + '/games/quiz/quizzes/' + taskId + '/questions')
        .then((res) => res.json())
        .then((json) => {
          json.forEach((question) => {
            let q = {
              question: question.question,
              answers: question.options,
              correctAnswers: question.answer,
              selectedAnswers: [],
              type: question.type,
              leftAnswers: question.options,
              rightAnswers: []
            };
            data.quizes.push(q);
          });
          io.to(data.sessionId).emit('updateGame', data);
          openSessions.set(data.sessionId, data);
        })
        .catch((err) => console.log(err));
    }
  } else {
    // TODO Maybe get answers later
    io.to(data.sessionId).emit('updateGame', data);
    openSessions.set(data.sessionId, data);
  }
}
