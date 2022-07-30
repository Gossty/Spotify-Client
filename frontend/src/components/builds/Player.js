import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { IconButton, Grid, LinearProgress } from '@mui/material';

import SpotifyIcon from "../../images/spotifyicon.png"

export default function Player(props) {

  const image = props.song.image_url_big;
  const title = props.song.title;
  const artist = props.song.artist;
  var is_playing = props.song.is_playing;
  const songProgress = ( props.song.time / props.song.duration) * 100;

  function PauseSong() {
    const requestOption = {
      method: 'PUT',
      headers: { "Content-Type": "application-json" }
    };
    fetch("/spotify/pause", requestOption);
    is_playing = !is_playing
  }

  function PlaySong() {
    const requestOption = {
      method: 'PUT',
      headers: { "Content-Type": "application-json" }
    };
    fetch("/spotify/play", requestOption)
    is_playing = !is_playing
  }

  function PlayNext() {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application-json" }
    };
    fetch("/spotify/play-next", requestOption);
  }

  function PlayPrevious() {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application-json" }
    };
    fetch("/spotify/play-previous", requestOption);
  }

  return (
    <div className='player'>

      <div className='player--info'>
        <img className="player--img" src={typeof image === 'undefined' ? SpotifyIcon : image} />

          <div className='player--meta'>
            <h5 className='player--title'>{typeof title === 'undefined' ? "Play Song" : title}</h5>
            <h6 className='player--artist'>{typeof artist === 'undefined' ? "Artist Name" : artist}</h6>
          </div>
      </div>

      <div className='player--media'>
              <IconButton onClick={() => PlayPrevious()}>
          <SkipPreviousIcon className="player--buttons"  />
          </IconButton>
        
          <IconButton onClick={() => {props.song.is_playing ? PauseSong() : PlaySong()}}>
                {props.song.is_playing ? <PauseIcon className="player--buttons" /> :
                  <PlayArrowIcon className="player--buttons"/>}
              </IconButton>
          <IconButton onClick={() => PlayNext()}>
          <SkipNextIcon className="player--buttons" />
              </IconButton>
        </div>    

      <LinearProgress className="player--progress" variant='determinate' value={songProgress} />
        
    
    </div>
  )
}
