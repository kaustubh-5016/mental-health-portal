import React, { useState } from 'react'

export default function Forum() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Dealing with Anxiety',
      author: 'Sarah',
      content: 'What are your best tips for managing anxiety? I find deep breathing helps...',
      likes: 12,
      comments: 5,
      tags: ['anxiety', 'self-help', 'tips']
    },
    {
      id: 2,
      title: 'Meditation Journey',
      author: 'Mike',
      content: 'I\'ve been meditating for 30 days straight. Here\'s what I\'ve learned...',
      likes: 8,
      comments: 3,
      tags: ['meditation', 'mindfulness']
    }
  ])

  const [activeTag, setActiveTag] = useState('all')

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))

  return (
    <div className="container">
      <div className="flex items-center mb-4">
        <h1 className="text-xl">Community Forum</h1>
        <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          New Post
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTag('all')}
            className={`px-3 py-1 rounded ${
              activeTag === 'all' ? 'bg-blue-600 text-white' : 'bg-white bg-opacity-10'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded ${
                activeTag === tag ? 'bg-blue-600 text-white' : 'bg-white bg-opacity-10'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {posts
          .filter(post => activeTag === 'all' || post.tags.includes(activeTag))
          .map(post => (
            <div key={post.id} className="bg-white shadow p-4 rounded">
              <h3 className="text-xl mb-2">{post.title}</h3>
              <div className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                <span>Posted by {post.author}</span>
                <span>•</span>
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-white bg-opacity-10 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-gray-300">
                <button className="flex items-center gap-1 hover:text-white">
                  <span>👍</span> {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-white">
                  <span>💬</span> {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-white">
                  <span>📤</span> Share
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}