__author__ = 'Gabriela'
import os
import pyen
import sys

#
# en = pyen.Pyen("CG0HTTJVRJVAJ7R5K")
# response = en.get('artist/similar', name='weezer')
# for artist in response['artists']:
#     print (artist['id'], artist['name'])

def mood(artist,song):
    en = pyen.Pyen("CG0HTTJVRJVAJ7R5K")
    response = en.get('song/search', artist=artist, title=song, bucket='audio_summary', results='1')
    mood=''
    if not response['songs']==[]:
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
    else:
        mood ='Unknown'
    return mood

if __name__ == "__main__":
    mood = mood(artist='Lana del Rey', song='Video games')
    print(mood)