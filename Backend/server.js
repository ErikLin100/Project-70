const express = require('express');

const dotenv = require('dotenv');
const errorHandler = require('./src/middlewares/errorHandler');
const cors = require('cors');


// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const downloadRouter = require('./src/routes/downloadRouter');
const videoProcessingRouter = require('./src/routes/videoProcessingRouter');




app.use('/api/download', downloadRouter);
app.use('/api/process-video', videoProcessingRouter);


// Error handling middleware
app.use(errorHandler);



// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});