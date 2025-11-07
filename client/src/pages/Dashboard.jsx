import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const moodData = [
    { day: 'Mon', mood: 4, label: '😊' },
    { day: 'Tue', mood: 3, label: '😐' },
    { day: 'Wed', mood: 5, label: '😄' },
    { day: 'Thu', mood: 4, label: '😊' },
    { day: 'Fri', mood: 4, label: '😊' }
  ]

  const stats = [
    { label: 'Journal Entries', value: '12' },
    { label: 'Mood Average', value: '4.2' },
    { label: 'Sessions', value: '3' },
    { label: 'Forum Posts', value: '8' }
  ]

  return (
    <div className="container">
      <div className="flex items-center mb-4">
        <h1 className="text-xl">Welcome back, User!</h1>
        <div className="flex gap-4 ml-auto">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white shadow p-2 rounded">
              <div className="text-gray-300 text-sm">{stat.label}</div>
              <div className="text-lg">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white shadow p-4 mb-4 rounded">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-xl mb-4">Weekly Mood Tracker</h2>
            <div className="mood-chart">
              <div className="flex gap-4 h-40 items-end justify-around">
                {moodData.map(day => (
                  <div key={day.day} className="flex flex-col items-center">
                    <div className="text-2xl mb-2">{day.label}</div>
                    <div 
                      className="mood-bar bg-blue-600"
                      style={{ height: `${day.mood * 20}%` }}
                    ></div>
                    <div className="mt-2 text-gray-300">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-48 h-48 relative mood-illustration">
            <img 
              src="/src/assets/mood-illus.svg" 
              alt="Mood tracking illustration"
              className="w-full h-full object-contain"
              style={{ filter: 'var(--svg-filter)' }}
            />
            <div className="absolute inset-0 bg-gradient-radial"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/journal" className="bg-white shadow p-4 rounded">
          <div className="text-2xl mb-2">📝</div>
          <h3 className="text-xl mb-2">Journal</h3>
          <p className="text-gray-300">Record your thoughts and track your emotional journey</p>
        </Link>

        <Link to="/forum" className="bg-white shadow p-4 rounded">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="text-xl mb-2">Community Forum</h3>
          <p className="text-gray-300">Connect with others and share experiences</p>
        </Link>

        <div className="bg-white shadow p-4 rounded">
          <div className="text-2xl mb-2">💡</div>
          <h3 className="text-xl mb-2">Daily Tips</h3>
          <p className="text-gray-300">Try deep breathing exercises when feeling stressed</p>
        </div>

        <Link to="/booking" className="bg-white shadow p-4 rounded">
          <div className="text-2xl mb-2">🗓️</div>
          <h3 className="text-xl mb-2">Book a Session</h3>
          <p className="text-gray-300">Schedule time with a mental health professional</p>
        </Link>
      </div>
    </div>
  )
}
