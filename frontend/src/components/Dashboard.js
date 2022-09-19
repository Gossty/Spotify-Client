import React, { useEffect, useState } from 'react'
import Player from './builds/Player';
import Sidebar from './builds/Sidebar';
import Center from "./builds/Center";
import SpotifyIcon from "../images/spotifyicon.png"


export default function Dashboard() {

  const [state, setState] = useState({
    song: {
      image_url_big: SpotifyIcon,
      title: "Play Song in Spotify Player",
      artist: "Artist Name",
      is_playing: false
    },
    showSettings: false,
    accessToken: "",
  })
  const [likedSongs, setLikedSongs] = useState({
    flag: false,
    name: "Liked Songs",
    description: "Your Liked Songs",
    next: "",
    prev:"",
    songs: [],
    ids: [],
    offset: 0
  })
  const [playlistid, setPlaylistId] = useState("0vvXsWCC9xrXsKd4FyS8kM");
  const [playlist, setPlaylist] = useState({
    image: "https://i.scdn.co/image/ab67706c0000bebbf4a34b7c32348e10489dc472",
    name: "Chilled Cow",
    description: "A daily selection of chill beats - perfect to help you relax &amp; study 📚",
    songs: [],
  });



  function getPlaylistSongs() {
    fetch(`spotify/get-playlist-songs/${playlistid}`)
      .then((response) => response.json())
      .then((data) => {
        setPlaylist((prevPlaylist) => {

          return {
            ...prevPlaylist,
            songs: data,
          }
        });
      })
  }
  useEffect(() => {
    getPlaylistSongs()
  }, [playlistid])



  function getLikedSongs() {
    let count = 0;

      fetch(`spotify/get-liked-songs/${likedSongs.offset}`)
      .then((response) => response.json())
      .then((data) => {
        setLikedSongs((prevLikedSongs) => {
          count++;
          for (let i = 0; i < data.songs.length; i++) {
            let str = "spotify:track:" + data.songs[i].id
            prevLikedSongs.ids.push(str)
          }
          return {
            ...prevLikedSongs,
            songs: prevLikedSongs.songs.concat(data.songs),
            prev: data.prev,
            next: data.next,
            offset: prevLikedSongs.offset + 50
          }
        });
      })
    


  }
  useEffect(() => {
    getLikedSongs();
  }, [])




  function getCurrentSong() {
    let isSong = true;
    fetch('spotify/current-song').then((response) => {
      if (response.status === 204) {
        isSong = false;
        return "no song playing"
      }
      return response.json();
    }).then((data) => {
      if (isSong) {
        setState({ song: data });
      }
      else {
        setState({
          song: {
            image_url_big: SpotifyIcon,
            title: "Play Song in Spotify Player",
            artist: "Artist Name",
            is_playing: false
          }
        })
      }
    });
  }
  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);
    return () => clearInterval(interval);
  }, [])



  return (
    <div className='dashboard'>

      <Center playlist={playlist}
              playlistid={playlistid}
              setState={setState}
              likedSongs={likedSongs}
              setLikedSongs={setLikedSongs}
              getLikedSongs={getLikedSongs}
               />
      
      <Sidebar setPlaylistId={setPlaylistId}
               setPlaylist={setPlaylist}
               likedSongs={likedSongs}
               setLikedSongs={setLikedSongs} />
      
      <Player song={state.song} />
      </div>
  )
}


