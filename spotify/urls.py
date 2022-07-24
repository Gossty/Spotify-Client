from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('pause', PauseSong.as_view()),
    path('play', PlaySong.as_view()),
    path('get-token', getTokens.as_view()),
    path('get-playlists', getPlaylists.as_view()),
    path('get-playlist-songs/<str:id>/', getPlaylistSongs.as_view()),
    path('play-song-playlist/<str:id>/<str:index>', playSongPlaylist.as_view()),
    path('get-liked-songs/<str:offset>/', getLikedSongs.as_view()),
    path('play-next', playNext.as_view()),
    path('play-previous', playPrevious.as_view()),
    path('play-liked-song/<str:index>', playLikedSong.as_view())
]