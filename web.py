__author__ = 'Maira'
from flask import Flask, render_template, Markup, request
import webbrowser
import threading
import time
import json
from getmusic import GetMusic

app = Flask(__name__)
songs = []
artists = []
albums = []
genders = []
songs_by_time = []
#options: ernestollamas, gabrielahrlr, ladeira_maira, mehreenikram
username = 'gabrielahrlr'

def open_browser():
    """
    opens the browser for "gui"
    """
    time.sleep(2)
    url = "http://localhost:5000"
    webbrowser.open(url)

@app.route("/")
def hello():
    global songs
    global artists
    global albums
    global genders
    global songs_by_time
    global username
    try:
        update_data(username)
    except Exception as e:
        print(e)
    return render_template('index.html', username=username, songs=songs_by_time)


def update_data(uname=''):
    global songs
    global artists
    global albums
    global genders
    global songs_by_time
    global username
    if not uname == '':
        username = uname
    gm = GetMusic(username)
    gm.get_data()
    songs_by_time = gm.get_time_songs()


@app.route("/<button>")
def click(button):
    """
    Simple button click, only with GET
    :param button: the domId of the button that was clicked
    :return:
    """
    print(button)
    try:
        if button == 'about':
            return render_template('about.html')
        if button == 'people':
            return render_template('people.html')
        if button == 'comparison':
            gabriela = GetMusic('gabrielahrlr')
            gabriela.get_data()
            gabriela_songs = gabriela.get_time_songs()
            gabriela_artists = gabriela.get_artists()
            maira = GetMusic('ladeira_maira')
            maira.get_data()
            maira_songs = maira.get_time_songs()
            maira_artists = maira.get_artists()
            mehreen = GetMusic('mehreenikram')
            mehreen.get_data()
            mehreen_songs = mehreen.get_time_songs()
            mehreen_artists = mehreen.get_artists()
            artists_genres = gabriela.get_artists_genre().copy()
            artists_genres.update(maira.get_artists_genre())
            artists_genres.update(mehreen.get_artists_genre())
            #print(gabriela_songs)
            #print(maira_songs)
            #print(mehreen_songs)
            return render_template('comparison.html',
                                   gabriela_songs=json.dumps(gabriela_songs),
                                   gabriela_artists=json.dumps(gabriela_artists),
                                   maira_songs=json.dumps(maira_songs),
                                   maira_artists=json.dumps(maira_artists),
                                   mehreen_songs=json.dumps(mehreen_songs),
                                   mehreen_artists=json.dumps(mehreen_artists),
                                   artists_genres=json.dumps(artists_genres))
        return "Page not found"
    except Exception as e:
        print(e)


@app.route("/<button>", methods=["POST"])
def upload(button):
    """
    Upload handler
    :param button: the domId of the button that was clicked
    :return:
    """
    global songs_by_time
    global username
    print(button)
    try:
        if button == 'getData':
            username = request.form['username']
            update_data(username)
            return json.dumps(songs_by_time)
        return "Undefined button: " + button
    except Exception as e:
        print(e)


if __name__ == "__main__":
    t = threading.Thread(target=open_browser)
    t.daemon = True
    t.start()
    app.run()
