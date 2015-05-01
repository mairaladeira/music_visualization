__author__ = 'Maira'
import time
import pickle
import os.path
import requests
import urllib
import re
import csv
from operator import itemgetter

class GetMusic:
    def __init__(self, username):
        api_key = "173f5a8f7ca577012bf10a5fd4ad4da3"
        #api_secret = "8049b8fe9bb82a39f95faee07a7a6692"
        rovicorp_api_key = "p2yqkycmyumrg84jy65pypxx"
        self.rovicorp_url = 'http://api.rovicorp.com/data/v1.1/song/info?apikey='+rovicorp_api_key
        self.limit = 200
        self.username = username
        self.lastfm_url = "http://ws.audioscrobbler.com/2.0/?api_key="+api_key+"&user="+username+"&format=json"
        self.url = "https://raw.githubusercontent.com/mairaladeira/music_visualization/master/page1.json?token=ADTzwkgxBao5o9hKcWp2tjr_GJGsUKqnks5VS_jtwA%3D%3D"
        self.songs = dict()
        self.artists = dict()
        self.albums = dict()
        self.genders = dict()
        self.time_songs = []
        self.start_time = time.time()
        self.csv = []
        self.genders_list = set()
        self.csvfile = open('data.csv', 'w')
        fieldnames = ['Name', 'Gender', 'Timestamp', 'Artist']
        self.csv_writer = csv.DictWriter(self.csvfile, fieldnames=fieldnames,delimiter=',')
        self.csv_writer.writeheader()

    def get_songs(self):
        return self.songs

    def get_artists(self):
        return self.artists

    def get_albums(self):
        return self.albums

    def get_genders(self):
        return self.genders

    def get_time_songs(self):
        return self.time_songs

    def get_music(self, page):
        url = self.lastfm_url+"&method=user.getrecenttracks&limit="+str(self.limit)+"&page="+str(page)
        #url = self.url
        r = requests.get(url)
        json_obj = r.json()
        data = json_obj['recenttracks']['track']
        info = json_obj['recenttracks']['@attr']
        if page == 1:
            for i in range(int(info['totalPages']), 1, -1):
                print('getting musics from: '+str(i))
                self.get_music(i)
        for s in data:
            self.format_song(s)
        #for key in self.genders.keys():
            #print(key)
        #TODO: add the get of new pages

    @staticmethod
    def encode_dict_key(key):
        key = key.lower()
        key = key.replace(' ', '').replace('-', '').replace("'", "").replace('"', '')
        return key

    def format_song(self, song):
        #print(song)
        if self.encode_dict_key(song['name']) not in self.songs:
            url = self.lastfm_url+"&method=track.gettoptags&artist="+urllib.parse.quote_plus(song['artist']['#text'])+\
                  "&track="+urllib.parse.quote_plus(song['name'])+"&limit=2"
            r = requests.get(url)
            json_obj = r.json()
            #print(json_obj)
            gender_obj = 'other'
            if 'tag' in json_obj['toptags']:
                i = 0
                for tag in json_obj['toptags']['tag']:
                    if 'name' in tag:
                        try:
                            if i == 0:
                                self.genders_list.add(tag['name'])
                                t = tag['name']
                                gender = self.parser_gender(t)
                                if gender != '':
                                    gender_obj = gender
                                    i += 1
                        except Exception as e:
                            print(e)
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
                if song['name'] not in self.genders[gender_obj]['musics']:
                    self.genders[gender_obj]['musics'].append(song['name'])
            self.songs[self.encode_dict_key(song['name'])] = song_obj
        elif 'date' in song:
            self.songs[self.encode_dict_key(song['name'])]['played'].append(song['date']['uts'])

        self.csv_writer.writerow({'Name': song['name'],
                                  'Gender': self.songs[self.encode_dict_key(song['name'])]['gender'],
                                  'Timestamp': song['date']['uts'],
                                  'Artist': song['artist']['#text']})
        t_song = [song['name'],
                  self.songs[self.encode_dict_key(song['name'])]['gender'],
                  song['artist']['#text'],
                  song['album']['#text'],
                  song['date']['uts']
                ]
        self.time_songs.append(t_song)
        if self.encode_dict_key(song['artist']['#text']) not in self.artists:
            artist_obj = {
                'artist': song['artist']['#text'],
                'albums': [],
                'musics': [],
                'played': []
            }
            self.artists[self.encode_dict_key(song['artist']['#text'])] = artist_obj
        if song['album']['#text'] not in self.artists[self.encode_dict_key(song['artist']['#text'])]['albums']:
            self.artists[self.encode_dict_key(song['artist']['#text'])]['albums'].append(song['album']['#text'])
        if song['name'] not in self.artists[self.encode_dict_key(song['artist']['#text'])]['musics']:
            self.artists[self.encode_dict_key(song['artist']['#text'])]['musics'].append(song['name'])
        elif 'date' in song:
            self.artists[self.encode_dict_key(song['artist']['#text'])]['played'].append(song['date']['uts'])

        if self.encode_dict_key(song['album']['#text']) not in self.albums:
            album_obj = {
                'album': song['album']['#text'],
                'artists': song['artist']['#text'],
                'musics': [],
                'played': []
            }
            self.albums[self.encode_dict_key(song['album']['#text'])] = album_obj
        if song['name'] not in self.albums[self.encode_dict_key(song['album']['#text'])]['musics']:
            self.albums[self.encode_dict_key(song['album']['#text'])]['musics'].append(song['name'])
        elif 'date' in song:
            self.albums[self.encode_dict_key(song['album']['#text'])]['played'].append(song['date']['uts'])



    @staticmethod
    def parser_gender(tag):
        """
        classic(involving blues, jazz,soul), rock (alternative rock, progressive rock etc),hip-hop (rap),electronic, indie, pop, latin,others
        :param tag:
        :return:
        """
        gender = tag.lower()
        acceptable_genders = ['classic', 'rock', 'hip-hop', 'electronic', 'indie', 'pop', 'latin']

        classic = ['blues', 'classic', 'jazz', 'soul']
        for c in classic:
            if re.search(r''+c, gender):
                return 'classic'
        if re.search(r'pop', gender):
            return 'pop'
        if re.search(r'rock', gender):
            return 'rock'
        latin = ['mpb', 'brazilian', 'brasileiro', 'sertanejo', 'espanhol', 'lespagnol', 'español', 'latin']
        for l in latin:
            if re.search(r''+l, gender):
                return 'latin'
        hiphop = ['hip-hop', 'hip hop', 'rap']
        for h in hiphop:
            if re.search(r''+h, gender):
                return 'hip-hop'
        electronic = ['electro', 'house', 'trance', 'techno']
        for e in electronic:
            if re.search(r''+e, gender):
                return 'electronic'
        if re.search(r'indie', gender):
            return 'indie'
        return ''

    def cache_data(self):
        self.csvfile.close()
        self.time_songs = sorted(self.time_songs, key=itemgetter(4))

        if not os.path.isfile(self.username+'_songs.pickle'):
            f = open(self.username+'_songs.pickle', 'ab+')
            f.close()
        with open(self.username+'_songs.pickle', 'wb+') as f:
            pickle.dump(self.songs, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.username+'_timesongs.pickle'):
            f = open(self.username+'_timesongs.pickle', 'ab+')
            f.close()
        with open(self.username+'_timesongs.pickle', 'wb+') as f:
            pickle.dump(self.time_songs, f, pickle.HIGHEST_PROTOCOL)
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
        print("--- %s seconds ---" % (time.time() - self.start_time))

    def get_cache_data(self):
        with open(self.username+'_songs.pickle', 'rb+') as f:
            try:
                self.songs = pickle.load(f)
                f.close()
            except Exception as e:
                print(e)
        with open(self.username+'_timesongs.pickle', 'rb+') as f:
            try:
                self.time_songs = pickle.load(f)
                f.close()
            except Exception as e:
                print(e)
        with open(self.username+'_artists.pickle', 'rb+') as f:
            try:
                self.artists = pickle.load(f)
                f.close()
            except Exception as e:
                print(e)
        with open(self.username+'_albums.pickle', 'rb+') as f:
            try:
                self.albums = pickle.load(f)
                f.close()
            except Exception as e:
                print(e)
        with open(self.username+'_genders.pickle', 'rb+') as f:
            try:
                self.genders = pickle.load(f)
                f.close()
            except Exception as e:
                print(e)


#test = GetMusic('ladeira_maira')
#test.get_cache_data()
#print(test.get_time_songs())
#print(test.get_songs())
#print(test.get_artists())
#print(test.get_albums())
#test.get_music(1)
#test.cache_data()

