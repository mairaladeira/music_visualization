__author__ = 'Maira'
import time
import pickle
import os.path
import json
import requests
import urllib

class GetMusic:
    def __init__(self, username):
        api_key = "173f5a8f7ca577012bf10a5fd4ad4da3"
        #api_secret = "8049b8fe9bb82a39f95faee07a7a6692"
        self.limit = 200
        self.username = username
        self.lastfm_url = "http://ws.audioscrobbler.com/2.0/?api_key="+api_key+"&user="+username+"&format=json"
        self.url = "https://raw.githubusercontent.com/mairaladeira/music_visualization/master/page1.json?token=ADTzwkgxBao5o9hKcWp2tjr_GJGsUKqnks5VS_jtwA%3D%3D"
        self.songs = dict()
        self.artists = dict()
        self.albums = dict()
        self.genders = dict()
        self.start_time = time.time()

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
        print('--------------------')
        print('--------------------')
        for a in self.artists:
            print(self.artists[a])
        print('--------------------')
        print('--------------------')
        for a in self.albums:
            print(self.albums[a])
        print('--------------------')
        print('--------------------')
        print('--------------------')
        print('--------------------')
        print('--------------------')
        print('--------------------')
        for g in self.genders:
            print(self.genders[g])
        print("--- %s seconds ---" % (time.time() - self.start_time))

    def format_song(self, song):
        #print(song)
        if song['name'] not in self.songs:
            url = self.lastfm_url+"&method=track.gettoptags&artist="+urllib.parse.quote_plus(song['artist']['#text'])+\
                  "&track="+urllib.parse.quote_plus(song['name'])+"&limit=2"
            r = requests.get(url)
            json_obj = r.json()
            gender_obj = 'other'
            if 'tag' in json_obj['toptags']:
                i = 0
                for tag in json_obj['toptags']['tag']:
                    if 'name' in tag:
                        try:
                            if i == 0:
                                t = tag['name']
                                gender = self.parser_gender(t)
                                if gender != '':
                                    gender_obj = gender
                                    i += 1
                        except Exception as e:
                            print(e)
                            #print(song['name'])
                            #print(json_obj['toptags']['tag'])
            song_obj = {
                'name': song['name'],
                'artist': song['artist']['#text'],
                'album': song['album']['#text'],
                'played': [song['date']['uts']],
                'icon': song['image'][2]['#text'],
                'gender': gender_obj
            }
            if gender_obj not in self.genders:
                self.genders[gender_obj] = {
                    'gender': gender_obj,
                    'musics': [song['name']]
                }
            else:
                self.genders[gender_obj]['musics'].append(song['name'])
            self.songs[song['name']] = song_obj
        else:
            self.songs[song['name']]['played'].append(song['date']['uts'])

        if song['artist']['#text'] not in self.artists:
            artist_obj = {
                'artist': song['artist']['#text'],
                'albums': set(),
                'musics': set(),
                'played': set()
            }
            self.artists[song['artist']['#text']] = artist_obj
        self.artists[song['artist']['#text']]['albums'].add(song['album']['#text'])
        self.artists[song['artist']['#text']]['musics'].add(song['name'])
        self.artists[song['artist']['#text']]['played'].add(song['date']['uts'])

        if song['album']['#text'] not in self.albums:
            album_obj = {
                'album': song['album']['#text'],
                'artists': song['artist']['#text'],
                'musics': set(),
                'played': set()
            }
            self.albums[song['album']['#text']] = album_obj
        self.albums[song['album']['#text']]['musics'].add(song['name'])
        self.albums[song['album']['#text']]['played'].add(song['date']['uts'])

    @staticmethod
    def parser_gender(tag):
        gender = tag.lower()
        acceptable_genders = ['acoustic', 'lounge', 'country', 'british','german', 'reggae', 'french', 'house', '80s',
                              'funky', 'alternative', 'soul', 'dance', 'party', 'electronic', 'rap']
        if 'mpb' in gender or 'brazilian' in gender or 'brasileiro' in gender:
            return 'brazilian'
        if 'rock' in gender and 'pop' in gender:
            return 'pop rock'
        if 'progressive rock' in gender:
            return 'progressive rock'
        if 'rock' in gender:
            return 'rock'
        if 'indie' in gender:
            return 'indie'
        if 'pop' in gender:
            return 'pop'
        if 'jazz' in gender:
            return 'jazz'
        for ag in acceptable_genders:
            if ag in gender:
                return ag
        return ''

    def cache_data(self):
        if not os.path.isfile(self.username+'_songs.pickle'):
            f = open(self.username+'_songs.pickle', 'ab+')
            f.close()
        with open(self.username+'_songs.pickle', 'wb+') as f:
            pickle.dump(self.songs, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.username+'_artists.pickle'):
            f = open(self.username+'_artists.pickle', 'ab+')
            f.close()
        with open(self.username+'_artists.pickle', 'wb+') as f:
            pickle.dump(self.artists, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.username+'_albums.pickle'):
            f = open(self.username+'_albums.pickle', 'ab+')
            f.close()
        with open(self.username+'_albums.pickle', 'wb+') as f:
            pickle.dump(self.albums, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.username+'_genders.pickle'):
            f = open(self.username+'_genders.pickle', 'ab+')
            f.close()
        with open(self.username+'_genders.pickle', 'wb+') as f:
            pickle.dump(self.genders, f, pickle.HIGHEST_PROTOCOL)
            f.close()

    def get_cache_data(self):
        with open(self.username+'_songs.pickle', 'rb+') as f:
            # Pickle the 'data' dictionary using the highest protocol available.
            try:
                self.songs = pickle.load(f)
                print(self.songs)
                f.close()
            except Exception as e:
                print(e)
        with open(self.username+'_artists.pickle', 'rb+') as f:
            # Pickle the 'data' dictionary using the highest protocol available.
            try:
                self.artists = pickle.load(f)
                print(self.artists)
                f.close()
            except Exception as e:
                print(e)
        with open(self.username+'_albums.pickle', 'rb+') as f:
            # Pickle the 'data' dictionary using the highest protocol available.
            try:
                self.albums = pickle.load(f)
                print(self.albums)
                f.close()
            except Exception as e:
                print(e)
        with open(self.username+'_genders.pickle', 'rb+') as f:
            # Pickle the 'data' dictionary using the highest protocol available.
            try:
                self.genders = pickle.load(f)
                print(self.genders)
                f.close()
            except Exception as e:
                print(e)


test = GetMusic('ladeira_maira')
test.get_cache_data()
#test.get_music()
#test.cache_data()

