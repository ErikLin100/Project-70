const { db } = require('../../config/firebase');

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
    return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all projects:', error);
    throw error;
  }
};

exports.getProjectById = async (projectId) => {
    try {
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
  
      return { 
        id: projectDoc.id, 
        ...projectData, 
        status, 
        clips 
      };
    } catch (error) {
      console.error('Error getting project by ID:', error);
      throw error;
    }
  };