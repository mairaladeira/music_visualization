__author__ = 'Maira'
import time
import pickle
import os.path
import requests
import urllib
import re
import csv
from operator import itemgetter
from mood import mood


class GetMusic:
    def __init__(self, username):
        api_key = "173f5a8f7ca577012bf10a5fd4ad4da3"
        #api_secret = "8049b8fe9bb82a39f95faee07a7a6692"
        self.limit = 200
        self.username = username
        self.lastfm_url = "http://ws.audioscrobbler.com/2.0/?api_key="+api_key+"&user="+username+"&format=json"
        self.songs = dict()
        self.artists = dict()
        self.albums = dict()
        self.genders = dict()
        self.time_songs = []
        self.start_time = time.time()
        self.csv = []
        self.genders_list = set()
        self.dir = os.path.dirname(os.path.realpath(__file__))
        #print(dir)
        #self.csvfile = open('data/data.csv', 'w+')
        fieldnames = ['Name', 'Gender', 'Timestamp', 'Artist']
       #self.csv_writer = csv.DictWriter(self.csvfile, fieldnames=fieldnames,delimiter=',')
        #self.csv_writer.writeheader()
        self.moods = dict()
        self.artists_genre = dict()

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

    def get_artists_genre(self):
        return self.artists_genre

    def get_music(self, page):
        url = self.lastfm_url+"&method=user.getrecenttracks&limit="+str(self.limit)+"&page="+str(page)
        #url = self.url
        r = requests.get(url)
        json_obj = r.json()
        data = json_obj['recenttracks']['track']
        info = json_obj['recenttracks']['@attr']
        if page == 1:
            if int(info['totalPages']) > 1000:
                total_pages = 10
            else:
                total_pages = int(info['totalPages'])
            for i in range(total_pages, 1, -1):
                print('getting musics from: '+str(i))
                self.get_music(i)

            print('getting musics from: 1')
        for s in data:
            self.format_song(s)

    @staticmethod
    def encode_dict_key(key):
        key = key.lower()
        key = key.replace(' ', '').replace('-', '').replace("'", "").replace('"', '')
        return key

    def format_song(self, song):
        if 'date' in song:
            song_date = song['date']['uts']
        else:
            song_date = '0'
        if self.encode_dict_key(song['name']) not in self.songs:
            url = self.lastfm_url+"&method=track.gettoptags&artist="+urllib.parse.quote_plus(song['artist']['#text'])+\
                                  "&track="+urllib.parse.quote_plus(song['name'])+"&limit=2&autocorrect=1"
            r = requests.get(url)
            json_obj = r.json()
            #print(json_obj)
            gender_obj = 'other'
            if song['name'] == 'Carousel Ride':
                gender_obj = 'pop'
            if 'toptags' in json_obj:
                if 'tag' in json_obj['toptags']:
                    i = 0
                    for tag in json_obj['toptags']['tag']:
                        if 'name' in tag:
                            try:
                                #self.genders_list.add(tag['name'])
                                if i == 0:
                                    t = tag['name']
                                    gender = self.parser_gender(t)
                                    if gender != '':
                                        gender_obj = gender
                                        i += 1
                            except Exception as e:
                                #print(e)
                                t = json_obj['toptags']['tag']['name']
                                gender = self.parser_gender(t)
                                if gender != '':
                                    gender_obj = gender
                                continue
            song_obj = {
                'name': song['name'].replace("'", "\'"),
                'played': 1,
                'gender': gender_obj
            }
            if gender_obj not in self.genders:
                self.genders[gender_obj] = {
                    'gender': gender_obj,
                    'musics': [song['name'].replace("'", "\'")]
                }
            else:
                if song['name'].replace("'", "\'") not in self.genders[gender_obj]['musics']:
                    self.genders[gender_obj]['musics'].append(song['name'].replace("'", "\'"))
            self.songs[self.encode_dict_key(song['name'])] = song_obj
        elif 'date' in song:
            self.songs[self.encode_dict_key(song['name'])]['played'] += 1
        #self.csv_writer.writerow({'Name': song['name'].replace("'", "\'"),
                                  #'Gender': self.songs[self.encode_dict_key(song['name'])]['gender'],
                                  #'Timestamp': song_date,
                                  #'Artist': song['artist']['#text']})
        t_song = [song['name'].replace("'", "\'"),
                  self.songs[self.encode_dict_key(song['name'])]['gender'],
                  song['artist']['#text'],
                  song['album']['#text'],
                  song_date,
                  song['image'][2]['#text']]
        self.time_songs.append(t_song)
        if self.encode_dict_key(song['artist']['#text']) not in self.artists:
            self.artists[self.encode_dict_key(song['artist']['#text'])] = 1
            self.artists_genre[self.encode_dict_key(song['artist']['#text'])] = self.songs[self.encode_dict_key(song['name'])]['gender']
        else:
            self.artists[self.encode_dict_key(song['artist']['#text'])] += 1
        if self.encode_dict_key(song['album']['#text']) not in self.albums:
            self.albums[self.encode_dict_key(song['album']['#text'])] = 1
        else:
            self.albums[self.encode_dict_key(song['album']['#text'])] += 1

    def parser_gender(self, tag):
        """
        :param tag:
        :return:
        """
        gender = tag.lower()
        """
            1. Jazz/blues, Cool/West Coast, Vocals, Latin, Swing, Avant Garde Jazz, Fusion, Contemporary,
               Country Blues, Classic Blues, Electric Blues, Acoustic Blues
        """
        jazz = ['blues', 'cool coast', 'jazz', 'west coast', 'vocals', 'latin', 'swing',
                'fusion', 'contemporary', 'cool/west coast', 'classic', 'piano']
        for j in jazz:
            if re.search(r''+j, gender):
                return 'jazz_blues'
        """
        4. Alternative/Indie, 80s Alternative, Punk, Goth/Industrial, Brit Pop/Brit Rock, Indie, Emo/Hardcore,
        Electropop, ‘00s Alternative
        """
        indie = ['indie', 'alternative', 'punk', 'goth', 'industrial',
                 'emo', 'hardcore', 'electropop', '00s alternative', 'brit', 'pop/brit']
        for i in indie:
            if re.search(r''+i, gender):
                return 'alternative_indie'
        """
        7. Pop, Adult Contemporary, 80s rock, 70s rock, 60s pop, 90s pop, 00s pop, Teen
        """
        pop = ['pop', 'coldplay', 'best tracks', 'adult contemporary', '80s pop', '70s pop',
               '60s pop', '90s pop', '00s', 'teen']
        for p in pop:
            if re.search(r''+p, gender):
                return 'pop'

        """
        5. Hip-hop/Rap, Old School, East Coast, 90s hip-hop/rap, International,
           Hitmakers, Instrumental, Southern, Midwest, West Coast
        """
        hiphop = ['hip-hop', 'hip hop', 'rap', 'trip hop', 'trip-hop', 'old school', 'east coast',
                  'international', 'hitmakers', 'instrumental', 'southern', 'midwest', 'west coast']
        for h in hiphop:
            if re.search(r''+h, gender):
                return 'hip-hop_rap'

        """
            Rock, 60s rock, 50s rock, Progressive/Art, Psychedelic, Jam, 80s rock, 90s rock, Surf, Hard Rock
        """
        rock = ['rock', '50s', '60s', '80s', '90s', 'paul mccartney', 'pink floyd',
                'psychedelic', 'progressive/art', 'jam', 'surf', 'u2']
        for r in rock:
            if re.search(r''+r, gender):
                return 'rock'
        """
        3. Metal, Classic Metal, Hair, Alt Metal, Black/Death, Trash metal, Heavy Metal
        """
        metal = ['metal', 'hair', 'black/death']
        for m in metal:
            if re.search(r''+m, gender):
                return 'metal'

        """
        6. Dance/Electronic, Ambient, Breakbeat, Downtempo, Techno, Electronica, House, Trance
        """
        electronic = ['electro', 'house', 'trance', 'techno', 'eclectonia', 'dance', 'party',
                      'ambient', 'breakbeat', 'downtempo', 'electronica']
        for e in electronic:
            if re.search(r''+e, gender):
                return 'dance_electronic'

        """
        8. R&B/Soul, Classic Soul, Classic R&B, Funk, Disco, Contemporary
        """
        rebsoul = ['r&b', 'soul', 'funk', 'disco', 'contemporary']
        for r in rebsoul:
            if re.search(r''+r, gender):
                return 'reb_soul'
        self.genders_list.add(gender)
        return ''

    @staticmethod
    def parser_countries(tag):
        return ''

    def cache_data(self):
        i = 0
        for ts in self.time_songs:
            self.time_songs[i].append(self.songs[self.encode_dict_key(ts[0])]['played'])
            i += 1
        #self.csvfile.close()
        self.time_songs = sorted(self.time_songs, key=itemgetter(4))
        artists = []

        for a in self.artists:
            artists.append([a, self.artists[a]])
        self.artists = sorted(artists, key=itemgetter(1), reverse=True)

        #print(self.artists)
        if not os.path.isfile(self.dir+'/data/'+self.username+'_songs.pickle'):
            f = open(self.dir+'/data/'+self.username+'_songs.pickle', 'ab+')
            f.close()
        with open(self.dir+'/data/'+self.username+'_songs.pickle', 'wb+') as f:
            pickle.dump(self.songs, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.dir+'/data/'+self.username+'_timesongs.pickle'):
            f = open(self.dir+'/data/'+self.username+'_timesongs.pickle', 'ab+')
            f.close()
        with open(self.dir+'/data/'+self.username+'_timesongs.pickle', 'wb+') as f:
            pickle.dump(self.time_songs, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.dir+'/data/'+self.username+'_artists.pickle'):
            f = open(self.username+'_artists.pickle', 'ab+')
            f.close()
        with open(self.dir+'/data/'+self.username+'_artists.pickle', 'wb+') as f:
            pickle.dump(self.artists, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.dir+'/data/'+self.username+'_artists_genre.pickle'):
            f = open(self.username+'_artists_genre.pickle', 'ab+')
            f.close()
        with open('data/'+self.username+'_artists_genre.pickle', 'wb+') as f:
            pickle.dump(self.artists_genre, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.dir+'/data/'+self.username+'_albums.pickle'):
            f = open(self.username+'_albums.pickle', 'ab+')
            f.close()
        with open(self.dir+'/data/'+self.username+'_albums.pickle', 'wb+') as f:
            pickle.dump(self.albums, f, pickle.HIGHEST_PROTOCOL)
            f.close()

        if not os.path.isfile(self.dir+'/data/'+self.username+'_genders.pickle'):
            f = open(self.username+'_genders.pickle', 'ab+')
            f.close()
        with open(self.dir+'/data/'+self.username+'_genders.pickle', 'wb+') as f:
            pickle.dump(self.genders, f, pickle.HIGHEST_PROTOCOL)
            f.close()
        print("--- %s seconds ---" % (time.time() - self.start_time))

    def get_data(self, update=False):
        if not os.path.isfile(self.dir+'/data/'+self.username+'_songs.pickle') or update:
            self.get_music(1)
            self.cache_data()
            print(self.artists_genre)
        else:
            with open(self.dir+'/data/'+self.username+'_songs.pickle', 'rb+') as f:
                try:
                    self.songs = pickle.load(f)
                    f.close()
                except Exception as e:
                    print(e)
            with open(self.dir+'/data/'+self.username+'_timesongs.pickle', 'rb+') as f:
                try:
                    self.time_songs = pickle.load(f)
                    f.close()
                except Exception as e:
                    print(e)
            with open(self.dir+'/data/'+self.username+'_artists.pickle', 'rb+') as f:
                try:
                    self.artists = pickle.load(f)
                    f.close()
                except Exception as e:
                    print(e)
            with open(self.dir+'/data/'+self.username+'_artists_genre.pickle', 'rb+') as f:
                try:
                    self.artists_genre = pickle.load(f)
                    f.close()
                except Exception as e:
                    print(e)
            with open(self.dir+'/data/'+self.username+'_albums.pickle', 'rb+') as f:
                try:
                    self.albums = pickle.load(f)
                    f.close()
                except Exception as e:
                    print(e)
            with open(self.dir+'/data/'+self.username+'_genders.pickle', 'rb+') as f:
                try:
                    self.genders = pickle.load(f)
                    f.close()
                except Exception as e:
                    print(e)
if __name__ == "__main__":
    # options: ernestollamas, gabrielahrlr, ladeira_maira, mehreenikram
    test = GetMusic('mehreenikram')
    update_data = True
    test.get_data(update=update_data)

