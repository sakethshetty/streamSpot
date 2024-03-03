// Import required modules
const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing cookies
app.use(cookieParser());

// Import user routes
const userRouter = require('./routes/userRouter');
app.use('/api', userRouter);

app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
