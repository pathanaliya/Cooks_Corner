require('dotenv').config();
const connectToMongoDb = require('./db');

const express = require("express");
const cors = require('cors');



const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.endsWith('.vercel.app') || origin === 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/foodresp', require('./routes/foodresp'));
app.use('/api/user', require('./routes/user'));
app.use('/api/chatbot', require('./routes/chatbot'));

const port = process.env.PORT || 4000;

async function startServer() {
  await connectToMongoDb();

  const server = app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the process using this port or set PORT to a free value in .env.`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
}

startServer().catch((err) => {
  console.error('Startup failure:', err);
  process.exit(1);
});