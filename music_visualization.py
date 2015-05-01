__author__ = 'Maira'
import pylast
import time
import pickle
import os.path


class GetMusics:

    def __init__(self, username):
        API_KEY = "173f5a8f7ca577012bf10a5fd4ad4da3"
        API_SECRET = "8049b8fe9bb82a39f95faee07a7a6692"
        aut_username = "ladeira_maira"
        password_hash = pylast.md5("901910mausp")
        self.start_time = time.time()
        self.network = pylast.LastFMNetwork(api_key=API_KEY,
                                            api_secret=API_SECRET,
                                            username=aut_username,
                                            password_hash=password_hash)
        self.username = username
        self.user = self.network.get_user(self.username)
        self.data = []
        self.time_stamp = self.get_cache_data()
        self.set_new_data()

    def get_cache_data(self):
        timestamp = None
        if os.path.isfile(self.username+'.pickle'):
            with open(self.username+'.pickle', 'rb+') as f:
                # Pickle the 'data' dictionary using the highest protocol available.
                try:
                    self.data = pickle.load(f)
                    timestamp = self.data[0].timestamp
                    f.close()
                except Exception as e:
                    print(e)
        else:
            f = open(self.username+'.pickle', 'ab+')
            f.close()
        return timestamp

    def set_new_data(self):
        new_data = self.user.get_recent_tracks(limit=None, cacheable=False, time_from=self.time_stamp, time_to=None)
        if len(new_data) > 0:
            with open(self.username+'.pickle', 'wb+') as f:
                # Pickle the 'data' dictionary using the highest protocol available.
                try:
                    data = new_data + self.data
                    pickle.dump(data, f, pickle.HIGHEST_PROTOCOL)
                    f.close()
                except Exception as e:
                    print(e)

    def get_data(self):
        songs = dict()
        songs_names = []
        artists = dict()
        artists_names = []
        albums = dict()
        albums_names = []
        #test = pylast.extract_items(self.data)
        i = 0
        for s in self.data:
            #print(help(s.track))
            #if i == 0:
            #tags = s.track.get_top_tags()
            #print(tags)
                #print(s.track.get_name())
                #print(s.track.get_artist().get_tags())
            i += 1
            if s.track.get_name() not in songs:
                if s.track.get_artist().get_name() not in artists:
                    artists.append(s.track.get_artist().get_name())
                songs[s.track.get_name()] = {
                    'song': s.track.get_name(),
                    'artist': s.track.get_artist().get_name(),
                    'album': s.album,
                    'dates': [s.timestamp]
                }
                songs_names.append(s.track.get_name())
            else:
                songs[s.track.get_name()]['dates'].append(s.timestamp)
        for s in songs_names:
            print(songs[s])
        print('--------------------')
        print('--------------------')
        print('--------------------')
        print(len(artists))
        for a in artists:
            print(a)

        print("--- %s seconds ---" % (time.time() - self.start_time))

    def get_tags(self, obj):
        tags = obj.get_top_tags(limit=2)
        return tags

test = GetMusics('ladeira_maira')
test.get_data()