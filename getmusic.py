__author__ = 'Maira'
import time
import pickle
import os.path
import json
import requests

class GetMusic:
    def __init__(self, username):
        api_key = "173f5a8f7ca577012bf10a5fd4ad4da3"
        #api_secret = "8049b8fe9bb82a39f95faee07a7a6692"
        self.limit = 200
        #self.url = "http://ws.audioscrobbler.com/2.0/?api_key="+api_key+"&user="+username+"&format=json"
        self.url = "https://raw.githubusercontent.com/mairaladeira/music_visualization/master/page1.json?token=ADTzwkgxBao5o9hKcWp2tjr_GJGsUKqnks5VS_jtwA%3D%3D"
        self.songs = dict()
        self.artists = []
        self.albums = []

    def get_music(self):
        #url = self.url+"&method=user.getrecenttracks&limit="+str(self.limit)
        url = self.url
        r = requests.get(url)
        json_obj = r.json()
        data = json_obj['recenttracks']['track']
        info = json_obj['recenttracks']['@attr']
        #print(data)
        for d in data:
            self.format_song(d)
        for s in self.songs:
            print(self.songs[s])

    def format_song(self, song):
        #print(song)
        if song['name'] not in self.songs:
            song_obj = {
                'name': song['name'],
                'artist': song['artist']['#text'],
                'album': song['album']['#text'],
                'played': [song['date']['uts']],
                'icon': [song['image'][2]['#text']]
            }
            self.songs[song['name']] = song_obj
        else:
            self.songs[song['name']]['played'].append(song['date']['uts'])

test = GetMusic('ladeira_maira')
test.get_music()