from unittest import TestCase
from flask import session
from app import app
from boggle import Boggle

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

class BoggleViewsTests(TestCase):

    def test_index_get_route(self):
        with app.test_client() as client:
            resp = client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<button id="start-game-btn" type="submit" class="btn btn-info">Start New Game</button>', html)
    
    def test_index_post_route_redirect(self):
        with app.test_client() as client:
            resp = client.post("/")

            self.assertEqual(resp.status_code, 302)
            self.assertEqual(resp.location, "http://localhost/boggle")

    def test_boggle_board_in_session_info(self):
        with app.test_client() as client:
            client.post("/")

            self.assertTrue(session['board'])

    def test_boggle_get_route(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                boggle_game = Boggle()
                session['board'] = boggle_game.make_board()
            
            resp = client.get('/boggle')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<td>', html)
            self.assertIn('<form id="guess-form" action="/boggle" method="POST">', html)