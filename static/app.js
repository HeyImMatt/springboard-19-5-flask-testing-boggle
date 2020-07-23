const guessBtn = document.querySelector('#guess-btn');

if (guessBtn) {
  guessBtn.addEventListener('click', checkGuess);
}

async function checkGuess() {
  event.preventDefault();
  const userGuessInput = document.querySelector('#user-guess');
  let userGuess = userGuessInput.value;

  try {
    let res = await axios.post('/boggle', { guess: userGuess });
    notifyUser(res.data.result);
  } catch (err) {
    notifyUser('error');
    throw new Error(err);
  }
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
      message = 'That\'s not even a word! 😖';
      alertStyle = 'alert-warning';
      break;

    case 'error':
      message = 'Oops! Something went wrong on our end 😬 Please try your guess again.';
      alertStyle = 'alert-danger';
      break;
  }
  gameAlert.classList.remove('d-none');
  gameAlert.classList.add(alertStyle);
  gameAlert.textContent = message;

  setTimeout(() => {
    gameAlert.classList.add('d-none');
    gameAlert.classList.remove(alertStyle);
  }, 1000)

}
