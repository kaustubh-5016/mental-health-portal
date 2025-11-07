import React, { useState } from 'react'

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [therapist, setTherapist] = useState('')
  
  const therapists = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Anxiety & Depression', availability: '9 slots' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Stress Management', availability: '5 slots' },
    { id: 3, name: 'Dr. Emma Williams', specialty: 'Relationship Counseling', availability: '7 slots' }
  ]

  const times = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '02:00 PM', '03:00 PM', '04:00 PM'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle booking submission
    console.log({ selectedDate, selectedTime, therapist })
  }

  return (
    <div className="container">
      <div className="flex items-center mb-4">
        <h1 className="text-xl">Book a Session</h1>
        <div className="ml-auto bg-white shadow p-2 rounded">
          <span className="text-gray-300">Available Slots: </span>
          <span className="text-lg">21</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl mb-4">Select Therapist</h2>
          <div className="grid gap-3">
            {therapists.map(t => (
              <button
                key={t.id}
                onClick={() => setTherapist(t.id)}
                className={`p-4 rounded text-left transition-all ${
                  therapist === t.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                }`}
              >
                <div className="text-lg mb-1">{t.name}</div>
                <div className="text-gray-300 text-sm">{t.specialty}</div>
                <div className="text-gray-300 text-sm">{t.availability} available</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-4">
            <h2 className="text-xl mb-4">Schedule Appointment</h2>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 bg-white bg-opacity-10 border rounded text-white"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Select Time</label>
              <div className="grid grid-cols-3 gap-2">
                {times.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded ${
                      selectedTime === time 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={!selectedDate || !selectedTime || !therapist}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Book Session
            </button>
          </form>

          <div className="bg-white shadow p-4 rounded">
            <h3 className="text-xl mb-2">Session Information</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• 50 minute session</li>
              <li>• Video or voice call available</li>
              <li>• Free cancellation up to 24h before</li>
              <li>• Post-session notes provided</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
