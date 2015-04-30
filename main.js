/**
 * Created by Maira on 4/30/15.
 */

music_data = [];
default_user = "ladeira_maira";
api_key = "173f5a8f7ca577012bf10a5fd4ad4da3";
limit = 200;
format = "json";
default_page = 1;
m_id = 0;

var getData = function(user, page){
    var json = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user="+user+"&api_key="+api_key+"&limit="+limit+"&format="+format+"&page="+page;
    json = "page"+page+".json";
    $.getJSON(json, function(data){
        console.log(data);
        var amount_pages = data.recenttracks["@attr"].totalPages;
        var tracks = data.recenttracks.track;
        console.log(page);
        $.each(tracks,function(id, track){
            if(id == 0){
              console.log(track);
            }
            var music_div = create_music_data(user,track);
            $('#visualization').append(music_div);
        });
        if (page == 4) {
            var max = 0;
            var max_id = [];
            console.log(music_data[user]);
            $.each(Object.keys(music_data[user]), function(id, d){
               if (music_data[user][d].dates.length > max) {
                   max = music_data[user][d].dates.length;
                   max_id = [d];
               } else {
                   if (music_data[user][d].dates.length == max)
                    max_id.push(d);
               }
            });
            console.log(max);
            console.log(max_id);
        }
        if (page  < amount_pages){
            getData(user, (page+1));
        }
    });
};

var create_music_data = function(user, track){
    if(!music_data[user]) music_data[user] = [];
    var music_div = document.createElement('div');
    music_div.id = m_id;
    m_id = m_id+1;
    if(!music_data[user][track.name]) music_data[user][track.name] = {
        artist: '',
        album: '',
        dates:[]
    };
    var music_icon = document.createElement('img');
    music_icon.src = track.image[2]['#text'];
    music_div.appendChild(music_icon);
    var music_name = document.createElement('h2');
    music_name.innerHTML = track.name;
    music_div.appendChild(music_name);
    var music_artist = document.createElement('div');
    music_artist.innerHTML = '<b>Artist:</b> '+track.artist['#text'];
    music_div.appendChild(music_artist);
    if (music_data[user][track.name]['artist'] == '')
        music_data[user][track.name]['artist'] = track.artist['#text'];
    var music_album = document.createElement('div');
    music_album.innerHTML = '<b>Album:</b> '+track.album['#text'];
    music_div.appendChild(music_album);
    if (music_data[user][track.name]['album'] == '')
        music_data[user][track.name]['album'] = track.album['#text'];
    var music_date = document.createElement('div');
    music_date.innerHTML = 'Listened on '+track.date['#text'];
    music_div.appendChild(music_date);
    music_data[user][track.name]['dates'].push(track.date['#text']);
    return music_div;
};

getData(default_user, default_page);