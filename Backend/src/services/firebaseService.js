const { admin, db } = require('../../config/firebase');
const bucket = admin.storage().bucket();

exports.uploadFile = async (filePath, destination) => {
  await bucket.upload(filePath, {
    destination: destination,
  });
  return bucket.file(destination).publicUrl();
};

exports.saveProjectToFirestore = async (projectData) => {
  if (!projectData.uid) {
    throw new Error('User ID is required to save project');
  }
  const docRef = await db.collection('projects').add({
    ...projectData,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  return docRef.id;
};

exports.saveClipToFirestore = async (clipData) => {
  const sanitizedClipData = Object.fromEntries(
    Object.entries(clipData).filter(([_, v]) => v != null)
  );
  const docRef = await db.collection('clips').add(sanitizedClipData);
  return docRef.id;
};

exports.updateProjectStatus = async (projectId, status) => {
  await db.collection('projects').doc(projectId).update({ status });
};

exports.deleteClip = async (clipId) => {
  try {
    const clipDoc = await db.collection('clips').doc(clipId).get();
    if (!clipDoc.exists) {
      console.warn(`Clip document ${clipId} not found in Firestore`);
    } else {
      const clipData = clipDoc.data();
      if (clipData.url) {
        const fileName = clipData.url.split('/').pop();
        const file = bucket.file(`clips/${fileName}`);
        const [exists] = await file.exists();
        if (exists) {
          await file.delete();
        } else {
          console.warn(`File ${fileName} not found in storage`);
        }
      }
      await db.collection('clips').doc(clipId).delete();
    }
  } catch (error) {
    console.error('Error deleting clip:', error);
    throw error;
  }
};

// New function to delete a project and its associated clips
exports.deleteProject = async (projectId) => {
  const projectRef = db.collection('projects').doc(projectId);

  try {
    // Start a Firestore batch
    const batch = db.batch();

    // Get the project data
    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
      throw new Error('Project not found');
    }
    const projectData = projectDoc.data();

    // Delete the full video from storage
    if (projectData.fullVideoUrl) {
      const fullVideoPath = projectData.fullVideoUrl.split('/').pop();
      await bucket.file(`videos/${fullVideoPath}`).delete().catch(console.error);
    }

    // Get all clips associated with this project
    const clipsSnapshot = await db.collection('clips').where('projectId', '==', projectId).get();

    // Delete clip files from storage and prepare to delete from Firestore
    const deletePromises = clipsSnapshot.docs.map(async (clipDoc) => {
      const clipData = clipDoc.data();
      if (clipData.url) {
        const clipPath = clipData.url.split('/').pop();
        await bucket.file(`clips/${clipPath}`).delete().catch(console.error);
      }
      // Add clip document to batch delete
      batch.delete(clipDoc.ref);
    });

    // Wait for all clip deletions to complete
    await Promise.all(deletePromises);

    // Delete the project document
    batch.delete(projectRef);

    // Commit the batch
    await batch.commit();

    console.log(`Project ${projectId} and associated clips deleted successfully`);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};