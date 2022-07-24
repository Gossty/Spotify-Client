import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRouts(props) {
  return props.spotifyAuthenticated ? <Outlet /> : <Navigate to="/" />
}
