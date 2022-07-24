import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import "../styles/style.css"
import "../styles/navbar.css"
import "../styles/dashboard.css"
import "../styles/root.css"
import "../styles/sidebar.css"
import "../styles/player.css"

import Dashboard from './Dashboard'
import HomePage from './HomePage'
import ProtectRout from './ProtectedRouts'
import Recommendations from './pages/Recommendations'
import Stats from './pages/Statistics'
import Home from "./pages/Home"


export default function App() {
  const [state, setState] = useState(false);
  function authenticate(a) {
    setState(x => x = a)
  }


  function authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) =>
        response.json())
      .then((data) => {
        authenticate(data.status);
      });
  }

  authenticateSpotify();

  return (
      <div>
        <Router>
        <Routes>
          <Route exact path="/" element={<HomePage authenticate={authenticate} logged={state} />} />
            <Route element={<ProtectRout spotifyAuthenticated={state} />}>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/home" element={<Home/>} />
                <Route exact path="/statistics" element={<Stats/>}/>
                <Route exact path="/recommendations" element={<Recommendations />} />
            </Route>
          </Routes>
        </Router>
      </div>

  )
}
