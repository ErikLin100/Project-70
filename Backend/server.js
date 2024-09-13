const express = require('express');

const dotenv = require('dotenv');
const errorHandler = require('./src/middlewares/errorHandler');
const cors = require('cors');
const { deleteClip } = require('./src/services/firebaseService');
const { getProjectStatus } = require('./src/services/projectService'); // Add this line
const { getAllProjects, getProjectById } = require('./src/services/projectService');

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

app.get('/api/status/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      const projectStatus = await getProjectStatus(projectId);
      res.json(projectStatus);
    } catch (error) {
      console.error('Error fetching project status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/projects/:projectId', async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await getProjectById(projectId);
      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

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

app.delete('/api/clips/:clipId', async (req, res) => {
  try {
    const { clipId } = req.params;
    await deleteClip(clipId);
    res.status(200).json({ message: 'Clip deleted successfully' });
  } catch (error) {
    console.error('Error deleting clip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});