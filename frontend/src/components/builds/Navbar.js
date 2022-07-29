import React from 'react'
import { useState } from 'react'
import {Link} from "react-router-dom"
import Dashboard from '../Dashboard'

export default function Navbar() {

    return (
    <nav className='navbar--dashboard'>
            <div className='navbar--container'>
                <Link className='navbar--link' to="/dashboard">
                     <h4 className='dashboard--back'>Dashboard</h4>
                </Link>
            </div>
            <div>
                <ul className='navbar--list'>
                    <li className='navbar--listelement'>
                        <Link className='navbar--link' to="/statistics">Statistics</Link>
                    </li>

                    <li className='navbar--listelement'>
                        <Link className='navbar--link' to="/recommendations">Recommendations</Link>
                    </li>
                </ul>
            </div>
    </nav>
    )
}
