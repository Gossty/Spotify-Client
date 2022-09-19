import React, { useEffect } from 'react'
import { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";

export default function HomePage(props) {

    if (props.logged) {
        return (
            <div>
                <Navigate to="/dashboard" />
            </div>
        )
    }
    const [authenticated, setAuthenticated] = useState({
        spotifyAuthenticated: false
    })
    function authenticateSpotify() {
      fetch("/spotify/is-authenticated")
        .then((response) => response.json())
        .then((data) => {
            props.authenticate(data.status);
            setAuthenticated({ spotifyAuthenticated: data.status })
          if (!data.status) {
            fetch("/spotify/get-auth-url")
              .then((response) => response.json())
              .then((data) => {
                window.location.replace(data.url);
              });
          }
        });
    }

    if (authenticated.spotifyAuthenticated) {
        return (
            <div>
                <Navigate to="/dashboard" />
            </div>
        )
    }
    return (
        <div className='home-page'>
            <nav className='home--navbar'>
                Gosty's Spotify!
                {<button className='home--login' onClick={authenticateSpotify}>Login to Spotify</button>}
            </nav>
            <div className='home--text'>
            <h1 className='home--maintext'>Log in to Spotify to view this project 🏹</h1>
            <h4 className='home--othertext'>You need to have Spotify Premium for all features</h4>
            <h4 className='home--otherothertext'>To get access to the website, email me: sgolzari@ucsd.edu</h4>
            </div>

        </div>
    )

}