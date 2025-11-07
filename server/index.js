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

app.get('/', (req, res) => res.send('MHP Server running'));

const PORT = process.env.PORT || 5001;

// Error handling for server startup
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or change PORT in .env`);
    process.exit(1);
  } else {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shutting down');
    process.exit(0);
  });
});
