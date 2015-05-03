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
    gm.get_cache_data()
    songs_l = gm.get_songs()
    artists_l = gm.get_artists()
    albums_l = gm.get_albums()
    genders_l = gm.get_genders()
    songs_by_time = gm.get_time_songs()
    for s in songs_l:
        songs.append(json.dumps(songs_l[s]))
    for a in artists_l:
        artists.append(json.dumps(artists_l[a]))
    for a in albums_l:
        albums.append(json.dumps(albums_l[a]))
    for g in genders_l:
        genders.append(json.dumps(genders_l[g]))


@app.route("/<button>")
def click(button):
    """
    Simple button click, only with GET
    :param button: the domId of the button that was clicked
    :return:
    """
    print(button)
    try:
        return "test"
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
