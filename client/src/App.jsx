import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import Forum from './pages/Forum'
import Booking from './pages/Booking'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/journal" element={<Journal/>} />
          <Route path="/forum" element={<Forum/>} />
          <Route path="/booking" element={<Booking/>} />
        </Routes>
      </main>
    </div>
  )
}
