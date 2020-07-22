const guessBtn = document.querySelector('#guess-btn')

if (guessBtn) {
  guessBtn.addEventListener('click', checkGuess)
}

async function checkGuess() {
  event.preventDefault();
  const userGuessInput = document.querySelector('#user-guess');
  let userGuess = userGuessInput.value; 

  try {
    let res = await axios.post('/boggle', { guess: userGuess });
    console.log(res.data.result)
  }
  catch(err) {
    alert('Guess did not go through. Please try again.')
    throw new Error(err)
  }
}