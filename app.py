from flask import Flask, redirect, request, render_template, flash, session, jsonify, Response
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
        session['high_score'] = 0
        return redirect('/boggle')

    else:
        return render_template('index.html')

@app.route('/boggle', methods=['GET', 'POST'])
def boggle_route():
    board = session.get('board')
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        if 'guess' in data:
            word = data['guess']
            guess_result = boggle_game.check_valid_word(board, word)
            return jsonify(result=guess_result)
        if 'score' in data:
            score = int(data['score'])
            high_score = int(session.get('high_score'))
            if score > high_score:
                  session['high_score'] = score
            return Response(status=200)
    else:
        return render_template('boggle.html')