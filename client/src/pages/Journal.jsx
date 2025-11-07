import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Journal() {
  const [text, setText] = useState('')
  const [mood, setMood] = useState('😊')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [error, setError] = useState(null)
  const [entries, setEntries] = useState([])

  const moods = ['😢', '😕', '😐', '😊', '😄']

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/journals')
      setEntries(response.data)
    } catch (err) {
      console.error('Failed to load entries:', err)
      setError('Failed to load journal entries')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!text.trim()) return

    setStatus('loading')
    setError(null)
    try {
      const response = await axios.post('http://localhost:5001/api/journals', {
        userId: 'demo-id',
        text,
        mood,
        date: new Date().toISOString()
      })
      setText('')
      setStatus('success')
      await loadEntries() // Reload entries after successful save
      setTimeout(() => setStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to save journal:', err)
      setError(err.message || 'Failed to save journal. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="container">
      <div className="flex items-center mb-4">
        <h1 className="text-xl">Journal Entries</h1>
        <div className="ml-auto bg-white shadow p-2 rounded">
          <span className="text-gray-300">Total Entries: </span>
          <span className="text-lg">{entries.length}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-4">
        <h2 className="text-xl mb-4">New Entry</h2>
        <div className="flex gap-4 mb-4">
          {moods.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`text-2xl p-2 rounded transition-all ${
                mood === m ? 'bg-blue-600 scale-110' : 'bg-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full h-40 p-2 bg-white bg-opacity-10 border rounded mb-4 text-white"
          placeholder="Write your thoughts here..."
        />
        <div className="flex items-center gap-4">
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'loading' ? 'Saving...' : 'Save Entry'}
          </button>
          {status === 'success' && (
            <span className="text-green-400">✓ Saved successfully</span>
          )}
          {error && (
            <span className="text-red-400">{error}</span>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {entries.map(entry => (
          <div key={entry._id} className="bg-white shadow p-4 rounded">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{entry.mood || '😊'}</span>
                <span className="text-gray-300">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
