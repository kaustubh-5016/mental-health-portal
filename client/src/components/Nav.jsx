import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const location = useLocation()
  
  const isActive = path => location.pathname === path ? 'bg-blue-600 text-white' : 'hover:bg-white hover:bg-opacity-10'
  
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex gap-4">
        <Link to="/" className={`px-4 py-2 rounded flex items-center gap-2 ${isActive('/')}`}>
          <span>🏠</span> Dashboard
        </Link>
        <Link to="/journal" className={`px-4 py-2 rounded flex items-center gap-2 ${isActive('/journal')}`}>
          <span>📝</span> Journal
        </Link>
        <Link to="/forum" className={`px-4 py-2 rounded flex items-center gap-2 ${isActive('/forum')}`}>
          <span>👥</span> Forum
        </Link>
        <Link to="/booking" className={`px-4 py-2 rounded flex items-center gap-2 ${isActive('/booking')}`}>
          <span>🗓️</span> Booking
        </Link>
      </div>
    </nav>
  )
}
