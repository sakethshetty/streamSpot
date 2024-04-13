const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Import Prisma instance configured for MongoDB
const prisma = require('./prisma');

const app = express();

app.use(cookieParser());

const store = new MongoDBStore({
  uri: process.env.DATABASE_URL,
  collection: 'sessions'
});

app.use(session({
  secret: 'your-strong-secret-key', 
  resave: false,
  saveUninitialized: true,
  store: store
}));

// it is a configure CORS to allow requests from your React app's origin
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import and use routes
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const videoRouter = require('./routes/videoRouter');


app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', videoRouter);

//Error handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
