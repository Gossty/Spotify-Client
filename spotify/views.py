from django.shortcuts import render, redirect
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
import os
import json
from dotenv import load_dotenv

load_dotenv()
CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")
REDIRECT_URI = os.environ.get('REDIRECT_URI')


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-collaborative playlist-read-private playlist-modify-private user-library-read user-top-read'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    def get(self, request, format=None):
        host = self.request.session.session_key
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)
        
        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover_big = item.get('album').get('images')[0].get('url')
        album_cover_mid = item.get('album').get('images')[1].get('url')
        album_cover_small = item.get('album').get('images')[2].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')
        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url_big': album_cover_big,
            'is_playing': is_playing,
            'id': song_id
        }

        return Response(song, status=status.HTTP_200_OK)

class PauseSong(APIView):
    def put(self, request, format=None):
        host = self.request.session.session_key
        pause_song(host)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

class PlaySong(APIView):
    def put(self, request, format=None):
        host = self.request.session.session_key
        play_song(host)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

class getTokens(APIView):
    def get(self, request, format=None):
        tokens = get_user_tokens(self.request.session.session_key)
        if tokens != None:
            access_token = tokens.access_token
            
        return Response({access_token}, status=status.HTTP_200_OK)

class getPlaylists(APIView):
    def get(self,request,format=None):
        host = self.request.session.session_key
        endpoint = "playlists"

        response = execute_spotify_api_request(host, endpoint)

        return Response(response, status=status.HTTP_200_OK)

class getPlaylistSongs(APIView): 
    def get(self, request, id, format=None):
        endpoint = f"playlists/{id}/tracks"
        host = self.request.session.session_key
        response = execute_spotify_api_request(host, endpoint, second_=True)  
        items = response.get('items')
        songs = []
        for i in range(len(items)):
            item = items[i].get('track')
            duration = item.get('duration_ms')
            album = item.get('album').get('name')
            album_cover_big = item.get('album').get('images')[0].get('url')
            album_cover_mid = item.get('album').get('images')[1].get('url')
            album_cover_small = item.get('album').get('images')[2].get('url')
            song_id = item.get('id')
            artist_string = ""

            for i, artist in enumerate(item.get('artists')):
                if i > 0:
                    artist_string += ", "
                name = artist.get('name')
                artist_string += name

            song = {
                'title': item.get('name'),
                'album': album,
                'artist': artist_string,
                'duration': duration,
                'image_url_big': album_cover_big,
                'image_url_mid': album_cover_mid,
                'image_url_small': album_cover_small,
                'id': song_id
            }
            songs.append(song)

        return Response(songs, status=status.HTTP_200_OK)

class playSongPlaylist(APIView):
    def put(self, request, id, index, format=None):
        host = self.request.session.session_key
        endpoint = f'player/play'
        if index != None:
            id = f'"spotify:playlist:{id}"'
            data='{"context_uri":' + id + ',"offset":{"position":' +index+'},"position_ms":0}'
            response = execute_spotify_api_request_data(host, endpoint, data, put_=True)
            return Response(response, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid PUT data'}, status=status.HTTP_400_BAD_REQUEST)

class playNext(APIView):
    def post(self,request, format=None):
        host = self.request.session.session_key
        endpoint = 'player/next'
        response = execute_spotify_api_request(host,endpoint, post_=True)
        return Response("Success: Play next song", status=status.HTTP_200_OK)

class playPrevious(APIView):
    def post(self,request, format=None):
        host = self.request.session.session_key
        endpoint = 'player/previous'
        response = execute_spotify_api_request(host,endpoint, post_=True)
        return Response("Success: Play next song", status=status.HTTP_200_OK)


class getLikedSongs(APIView):
    def get(self, request, offset, format=None):
        host = self.request.session.session_key
        endpoint = f'tracks/?limit=50&offset={offset}'
        response = execute_spotify_api_request(host,endpoint)
        items = response.get('items')
        songs = []
        prev = response.get('prev')
        next = response.get('next')
    
        for i in range(len(items)):
            item = items[i].get('track')
            duration = item.get('duration_ms')
            album = item.get('album').get('name')
            album_cover_big = item.get('album').get('images')[0].get('url')
            song_id = item.get('id')
            artist_string = ""

            for i, artist in enumerate(item.get('artists')):
                if i > 0:
                    artist_string += ", "
                name = artist.get('name')
                artist_string += name

            song = {
                'title': item.get('name'),
                'album': album,
                'artist': artist_string,
                'duration': duration,
                'image_url_big': album_cover_big,
                'id': song_id
            }
            songs.append(song)

        likedPlaylist = {
            'songs': songs,
            'next': next,
            'prev': prev
        }
        return Response(likedPlaylist, status=status.HTTP_200_OK)

class playLikedSong(APIView):
    def put(self, request, index, format=None):
        host = self.request.session.session_key
        endpoint = f'player/play'
        ids = json.dumps(json.loads(request.body)) 
        if index != None:
            data='{"uris":' + ids + ',"offset":{"position":' +index+'},"position_ms":0}'
            response = execute_spotify_api_request_data(host, endpoint, data, put_=True)
            return Response(response, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid PUT data'}, status=status.HTTP_400_BAD_REQUEST)