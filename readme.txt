# mental-health-portal (Boilerplate)

This document contains a full Git-ready MERN boilerplate you can copy into a repo. Files are shown with paths and contents. Paste each file into your project and run the install commands in the README.

---

## Repository layout

```
mental-health-portal/
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Journal.jsx
│   │   │   ├── Forum.jsx
│   │   │   └── Booking.jsx
│   │   ├── components/
│   │   │   └── Nav.jsx
│   │   └── services/api.js
│   ├── postcss.config.cjs
│   └── tailwind.config.cjs
├── server/
│   ├── package.json
│   ├── index.js
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── journals.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── journalController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Journal.js
│   └── utils/
│       └── sentiment.js
├── .gitignore
├── README.md
├── .env.example
└── requirements.txt
```

---

## Root files

### .gitignore

```
node_modules/
.env
client/node_modules/
server/node_modules/
dist/
.vscode/
.DS_Store
```

### .env.example

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### requirements.txt

This is a helper file listing the Node and npm dependencies and the commands to install them. It's not a Python requirements file. Run these commands from the repo root.

```
# Node
node>=16.x
npm>=8.x

# Install server deps
cd server
npm install express mongoose dotenv bcryptjs jsonwebtoken cors nodemailer sentiment

# Install client deps (Vite + React + Tailwind)
cd ../client
npm install
# client package.json defines needed dependencies (react, react-dom, react-router-dom, axios, tailwindcss)

# Development tip: from project root run:
# npm run dev:server   (in server)
# npm run dev:client   (in client)
```

---

## server/package.json

```
{
  "name": "mhp-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.0.0",
    "nodemailer": "^6.9.0",
    "sentiment": "^5.0.2"
  }
}
```

## server/index.js

```js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/journals', require('./routes/journals'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## server/config/db.js

```js
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

module.exports = async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
```

## server/models/User.js

```js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
```

## server/models/Journal.js

```js
const mongoose = require('mongoose');
const JournalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  mood: { type: String },
  sentimentScore: { type: Number }
}, { timestamps: true });
module.exports = mongoose.model('Journal', JournalSchema);
```

## server/routes/auth.js

```js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
```

## server/controllers/authController.js

```js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({ email, password: hash });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid creds' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid creds' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
```

## server/routes/journals.js

```js
const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

// Create journal
router.post('/', journalController.createJournal);
// Get user's journals
router.get('/user/:userId', journalController.getByUser);

module.exports = router;
```

## server/controllers/journalController.js

```js
const Journal = require('../models/Journal');
const sentiment = require('sentiment')();

exports.createJournal = async (req, res) => {
  const { userId, text } = req.body;
  try {
    const result = sentiment.analyze(text || '');
    const mood = result.score > 1 ? 'positive' : result.score < -1 ? 'negative' : 'neutral';
    const journal = new Journal({ user: userId, text, mood, sentimentScore: result.score });
    await journal.save();
    res.json(journal);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getByUser = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
```

---

## client/package.json

```
{
  "name": "mhp-client",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.5.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vite": "^5.1.0"
  }
}
```

## client/postcss.config.cjs

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

## client/tailwind.config.cjs

```js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: []
};
```

## client/index.html

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MHP Client</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## client/src/main.jsx

```jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
```

## client/src/App.jsx

```jsx
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
```

## client/src/components/Nav.jsx

```jsx
import React from 'react'
import { Link } from 'react-router-dom'
export default function Nav(){
  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/booking">Booking</Link>
      </div>
    </nav>
  )
}
```

## client/src/pages/Dashboard.jsx

```jsx
import React from 'react'
export default function Dashboard(){
  return <div>Dashboard - mood analytics and quick links</div>
}
```

## client/src/pages/Journal.jsx

```jsx
import React, { useState } from 'react'
import axios from 'axios'

export default function Journal(){
  const [text, setText] = useState('')
  const handleSubmit = async e =>{
    e.preventDefault()
    // demo userId placeholder
    await axios.post('http://localhost:5000/api/journals', { userId: 'demo-id', text })
    setText('')
    alert('Saved (demo)')
  }
  return (
    <div>
      <h2 className="text-xl mb-2">Anonymous Journal</h2>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-40 p-2 border" />
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white">Save</button>
      </form>
    </div>
  )
}
```

## client/src/pages/Forum.jsx

```jsx
import React from 'react'
export default function Forum(){
  return <div>Forum - coming soon</div>
}
```

## client/src/pages/Booking.jsx

```jsx
import React from 'react'
export default function Booking(){
  return <div>Booking - demo calendar placeholder</div>
}
```

## client/src/services/api.js

```js
import axios from 'axios'
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' })
export default API
```

## client/src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root { height: 100%; }
```

---

## README.md

```
# Student Mental Health Portal (Boilerplate)

## Quickstart

1. Copy files into a repo using the layout in this doc.
2. Create a MongoDB Atlas cluster and fill .env with MONGO_URI and JWT_SECRET.
3. Install server deps:
   cd server
   npm install
4. Install client deps:
   cd ../client
   npm install
5. Run server:
   cd ../server
   npm run dev
6. Run client:
   cd ../client
   npm run dev

Server runs at http://localhost:5000 and client at http://localhost:5173

This is a minimal scaffold. Add auth guards, proper user flows, validation, tests, and production hardening before deploying.
```

---

If you want I can now:
- generate these files as separate downloadable files, or
- create a single zip, or
- start filling in more endpoints (forum, booking) and UI pages.

Tell me which next step.

