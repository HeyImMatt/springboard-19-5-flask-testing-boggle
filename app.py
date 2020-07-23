from flask import Flask, redirect, request, render_template, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = '1579'

debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

boggle_game = Boggle()

@app.route('/', methods=['GET', 'POST'])
def home_route():
    if request.method == 'POST': 
        session['board'] = boggle_game.make_board()
        return redirect('/boggle')

    else:
        return render_template('index.html')

@app.route('/boggle', methods=['GET', 'POST'])
def boggle_route():
    board = session.get('board')
    if request.method == 'POST':
        data = request.get_json()
        word = data['guess'].lower()
        guess_result = boggle_game.check_valid_word(board, word)
        return jsonify(result=guess_result)
    else:
        return render_template('boggle.html')