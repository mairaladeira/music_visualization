Music Visualization: EM-DMKM Master project
--------------------------------------------

Project for representing personal music data in a time domain.

Development Group:
   * Gabriela Hernandez,
   * Maira Machado Ladeira,
   * Mehreen Ikram
   
   
Requirements:
 
This project requires the installation of pickle and flask libraries and works with Python 3.
   
Get data (or update existent one): 
```
python getmusic.py -u <lastfm_username>
```

Execute web application: (Currently the only available users for the web application are: gabrielahrlr, ladeira_maira or mehreenikram)
```
python web.py
```

The browser should automatically open with this request. 
This application has only been tested in chrome browse under Mac OS system and requires a windows width of at least 1280px.

Available data visualization:
   * Stacked tiles map
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/main_vis_gabriela.jpg)
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/hover_song.jpg)
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/song_detail.jpg)
   * Stacked daily bar histogram
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/histogram_gabriela.jpg)
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/histogram_gabriela_pop_evo.jpg)
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/histogram_gabriela_several_evol.jpg)
   * Stacked hourly bar histogram
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/hours_histogram_gabriela.jpg)
   * Genres bars histogram
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/genres_histogram_gabriela.jpg)
   * Word clouds
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/word_cloud.jpg)
   * Venn diagrams and
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/venn_diagram.jpg)
   * Genres timelines
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/time_searcher_representation.jpg)
   ![alt tag](https://raw.githubusercontent.com/mairaladeira/music_visualization/master/screenshots/time_searcher_jazz_blues.jpg)