import React, { useEffect } from 'react'

export default function Song(props) {
  let changeState = false;

  function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
        ? minutes + 1 + ":00"
        : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function handleState() {

    props.setSongState(props.count)
    changeState = true;
  }
  if (changeState) {
    props.setState(() => {
      return {
        song: {
          artist: props.artist,
          duration: props.duration,
          id: props.id,
          image_url_big: props.image_url_big,
          is_playing: true,
          time: 0,
          title: props.title
        }
      }
    })
  }

  
  const time = millisToMinutesAndSeconds(props.duration);
  return (
    <div className='song' onClick={() => handleState()}>
      <p className='song--index'>{props.index}</p>
      <img className='song--image' src={props.image_url_big} />
      <div>
        <p className='song--title'>{props.title}</p>
        <p className='song--artist'>{props.artist}</p>
      </div>
      <p>{props.album}</p>
      <p>{time}</p>
    </div>
  )
}
