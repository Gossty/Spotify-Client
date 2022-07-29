import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import HomeIcon from '@mui/icons-material/Home';
import { IconButton, Switch } from '@mui/material';

export default function Sidebar(props) {

  const [playlists, setPlaylists] = useState([])
  let isLiked = true;

    function getPlaylists() {
      fetch('spotify/get-playlists')
        .then((response) => response.json())
        .then((data) => setPlaylists(data.items)) 
    }
  
  
    useEffect(() => {
      getPlaylists()
    }, [])
    
  
  function showLiked() {
    props.setLikedSongs((prevLikedSongs) => {
      return {
        ...prevLikedSongs,
        flag: true
      }
    });
    }

    
    
  return (
    <div className='sidebar'>
      <div className='sidebar--home'>
        <IconButton >
          <a href="https://github.com/Gossty/Spotify-Client" className='sidebar--playlist'>Github</a>
        </IconButton>
        <p className='sidebar--playlist' onClick={() => showLiked()}>Liked Songs</p>
        <hr className='hr--boy'></hr>
      </div>

      <div className='sidebar--playlists'>
        {playlists.map((playlist) => (
          <p key={playlist.id} className="sidebar--playlist" onClick={() => {
            isLiked = false;
            props.setPlaylistId(playlist.id)
            props.setPlaylist({
              image: playlist.images[0].url,
              name: playlist.name,
              description: playlist.description,
              songs: []
            })
          }
          }>
                {playlist.name}
          </p>
          ))}
      </div>


    </div>
  )
}
