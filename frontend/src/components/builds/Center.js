import React from 'react'
import Song from '../song/Song'
import { useState, useEffect} from 'react';
import Pause from '@mui/icons-material/Pause';
import likedIcon from "../../images/likedsongs.png"

export default function Center(props) {


    const [songState, setSongState] = useState(0)

    function playSongPlaylist() {
        if (songState != 0) {
            const requestOption = {
                method: 'PUT',
                headers: { "Content-Type": "application-json" },
            };
            fetch(`spotify/play-song-playlist/${props.playlistid}/${songState - 1}`, requestOption)
        }
        
    }

    useEffect(() => {
        if (props.likedSongs.flag)
            playLikedSong();
        else
            playSongPlaylist();
    }, [songState])

    function playLikedSong() {
        const requestOption = {
            method: "PUT",
            headers: { "Content-Type": "application-json" },
            body: JSON.stringify(props.likedSongs.ids)
        };
        fetch(`spotify/play-liked-song/${songState - 1}`, requestOption)
    }

    let count = 1;
    let flag = false;
    let jsx = "";
    if (props.playlist.description.charAt(0) == "<" && props.playlist.description.charAt(1) == "a") {
        flag = true;
        jsx = props.playlist.description
    }

    if (props.likedSongs.flag) {
        return (
            <div className='center'>
            <div className='center--playlist'>
              <img src={likedIcon} className="center--playlist--image"/>
              <div>
                <p className='center--playlist--name'>{props.likedSongs.name}</p>
                <p className='center--playlist--description'>{props.likedSongs.description}</p>
                </div>
            </div>
  
            {props.likedSongs.songs.map((song) => (
                
                <Song key={song.id + "LikedSongs"} className="center--songs"
                    album={song.album}
                    title={song.title}
                    artist={song.artist}
                    duration={song.duration}
                    image_url_big={song.image_url_big}
                    time={0}
                    id={song.id}
                    setSongState={setSongState}
                    setState={props.setState}
                    count={count}
                    index={count++}
                />
            ))}
            <button className='.home--login' onClick={() => props.getLikedSongs()}>Next</button>
      </div>
        )
    }

  return (
      <div className='center'>
          <div className='center--playlist'>
            <img src={props.playlist.image} className="center--playlist--image"/>
            <div>
              <p className='center--playlist--name'>{props.playlist.name}</p>
                  {flag ? <div className='center--playlist--description' dangerouslySetInnerHTML={{ __html: jsx }}></div>
                      : <p className='center--playlist--description'>{props.playlist.description}</p>}
              </div>
              
          </div>

          {props.playlist.songs.map((song) => (
              
              <Song key={song.id + props.playlistid} className="center--songs"
                  album={song.album}
                  title={song.title}
                  artist={song.artist}
                  duration={song.duration}
                  time={song.time}
                  image_url_big={song.image_url_big}
                  id={song.id}
                  setSongState={setSongState}
                  setState={props.setState}
                  count={count}
                  index={count++}
              />
          ))}
    </div>
  )
}



