const { db } = require('../../config/firebase');
const { deleteProject } = require('./firebaseService');

exports.getProjectStatus = async (projectId) => {
    try {
      const projectRef = db.collection('projects').doc(projectId);
      const projectDoc = await projectRef.get();
  
      if (!projectDoc.exists) {
        throw new Error('Project not found');
      }
  
      const projectData = projectDoc.data();
      
      // Fetch clips associated with this project
      const clipsSnapshot = await db.collection('clips').where('projectId', '==', projectId).get();
      const clips = clipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // If clips are found, set status to 'Completed' regardless of stored status
      const status = clips.length > 0 ? 'Completed' : projectData.status;
  
      return {
        status,
        clips
      };
    } catch (error) {
      console.error('Error getting project status:', error);
      throw error;
    }
};

exports.getAllProjects = async () => {
    try {
      const projectsSnapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
      
      // Get all project IDs
      const projectIds = projectsSnapshot.docs.map(doc => doc.id);
      
      // Fetch all clips for these projects in a single query
      const clipsSnapshot = await db.collection('clips')
        .where('projectId', 'in', projectIds)
        .get();
  
      // Count clips for each project
      const clipCounts = {};
      clipsSnapshot.forEach(doc => {
        const clip = doc.data();
        clipCounts[clip.projectId] = (clipCounts[clip.projectId] || 0) + 1;
      });
  
      // Map projects with clip counts
      return projectsSnapshot.docs.map(doc => {
        const projectData = doc.data();
        return {
          id: doc.id,
          ...projectData,
          clipCount: clipCounts[doc.id] || 0,
          status: clipCounts[doc.id] > 0 ? 'Completed' : projectData.status
        };
      });
    } catch (error) {
      console.error('Error getting all projects:', error);
      throw error;
    }
};

exports.getProjectById = async (projectId) => {
  try {
    console.log('Fetching project with ID:', projectId);

    const projectDoc = await db.collection('projects').doc(projectId).get();
    if (!projectDoc.exists) {
      throw new Error('Project not found');
    }

    const projectData = projectDoc.data();

    // Fetch clips associated with this project
    const clipsSnapshot = await db.collection('clips').where('projectId', '==', projectId).get();
    const clips = clipsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // If clips are found, set status to 'Completed' regardless of stored status
    const status = clips.length > 0 ? 'Completed' : projectData.status;

    // Create a full video object similar to clips
    const fullVideo = {
      id: projectDoc.id,
      title: projectData.title,
      url: projectData.fullVideoUrl || '',
    };

    // Return the project data along with clips and full video object
    return { 
      id: projectDoc.id, 
      ...projectData, 
      status, 
      clips,
      fullVideo
    };
  } catch (error) {
    console.error('Error getting project by ID:', error);
    throw error;
  }
};

// Export the deleteProject function from firebaseService
exports.deleteProject = deleteProject;