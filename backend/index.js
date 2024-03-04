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
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store,
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import and use routes
const userRouter = require('./routes/userRouter');
app.use('/api', userRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
