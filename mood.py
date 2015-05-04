__author__ = 'Gabriela'
import os
import pyen
import sys
import requests
import urllib

#
# en = pyen.Pyen("CG0HTTJVRJVAJ7R5K")
# response = en.get('artist/similar', name='weezer')
# for artist in response['artists']:
#     print (artist['id'], artist['name'])

def mood(artist,song):
    #en = pyen.Pyen("CG0HTTJVRJVAJ7R5K")
    #response = en.get('song/search', artist=artist, title=song, bucket='audio_summary', results='1')
    #http://developer.echonest.com/api/v4/song/search?api_key=CG0HTTJVRJVAJ7R5K&format=json&results=1&artist=radiohead&title=karma%20police&bucket=id:7digital-US&bucket=audio_summary&bucket=tracks
    url = "http://developer.echonest.com/api/v4/song/search?api_key=CG0HTTJVRJVAJ7R5K&format=json&results=1&artist="\
          + urllib.parse.quote_plus(artist)+"&title=" + urllib.parse.quote_plus(song)\
          + "&bucket=audio_summary"
    r = requests.get(url)
    response = r.json()
    if 'response' in response:
        response = response['response']
    else:
        return 'Unknown'
    #print(response)
    mood='Unknown'
    if 'songs' in response:
        for song in response['songs']:
            energy = song['audio_summary']['energy']
            valence = song['audio_summary']['valence']
            if valence <= 0.5 and energy >= 0.5 :
                mood ='Angry'
            elif valence <= 0.5 and energy <= 0.5:
                mood ='Sad'
            elif valence > 0.5 and energy < 0.5:
                mood = 'Calm'
            elif valence > 0.5 and energy > 0.5:
                mood = 'Happy'
            else:
                mood ='Unknown'
        #print(mood)

    else:
        mood ='Unknown'
    return mood

if __name__ == "__main__":
    mood = mood(artist='U2', song='With or Without You')
    print(mood)