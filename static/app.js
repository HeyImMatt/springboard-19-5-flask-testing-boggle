const newGameBtn = document.querySelector('#start-game-btn');
const guessBtn = document.querySelector('#guess-btn');

// if (newGameBtn) {
//   newGameBtn.addEventListener('click', () => {
//     currentGame = new Game;
//   });
// }

if (guessBtn) {
  guessBtn.addEventListener('click', checkGuess)
}

class Game {
  constructor() {
    this.playedWords = [];
    this.gameScore = 0;
    this.gameOver = false;
  }

  gameTimerHandler() {
    const timer = document.querySelector('#timer');
    let gameTime = 60;
    let counter = setInterval(() => {
      gameTime -= 1;
      timer.textContent = gameTime;

      if (gameTime === 0) {
        clearInterval(counter);
        timer.textContent = 'Game Over!';
        this.gameOverHandler();
      }
    }, 1000);
  }

  gameOverHandler() {
    const guessForm = document.querySelector('#guess-form');
    guessForm.remove();
    this.gameOver = true;
  }

  updateScore(wordScore) {
    const scoreDiv = document.querySelector('#score-div');
    currentGame.gameScore += wordScore;
    scoreDiv.textContent = currentGame.gameScore;
  }
}

async function checkGuess() {
  event.preventDefault();
  const userGuessInput = document.querySelector('#user-guess');
  let userGuess = userGuessInput.value.trim().toLowerCase();
  let wordScore = userGuess.length;

  try {
    let res = await axios.post('/boggle', { guess: userGuess });
    notifyUser(res.data.result);
    if (res.data.result === 'ok') {
      currentGame.updateScore(wordScore);
    }
  } catch (err) {
    notifyUser('error');
    throw new Error(err);
  }

  userGuessInput.value = '';
}

function notifyUser(result) {
  const gameAlert = document.querySelector('#game-alert');
  let message;
  let alertStyle;

  switch (result) {
    case 'ok':
      message = 'Good word! 😄';
      alertStyle = 'alert-success';
      break;

    case 'not-on-board':
      message = 'Sorry, that word is not on the board 😕';
      alertStyle = 'alert-warning';
      break;

    case 'not-word':
      message = "That's not even a word! 😖";
      alertStyle = 'alert-warning';
      break;

    case 'error':
      message =
        'Oops! Something went wrong on our end 😬 Please try your guess again.';
      alertStyle = 'alert-danger';
      break;
  }
  gameAlert.classList.remove('d-none');
  gameAlert.classList.add(alertStyle);
  gameAlert.textContent = message;

  setTimeout(() => {
    gameAlert.classList.add('d-none');
    gameAlert.classList.remove(alertStyle);
  }, 1000);
}

let currentGame = new Game();
currentGame.gameTimerHandler();
