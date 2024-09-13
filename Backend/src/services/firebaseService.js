const { admin, db } = require('../../config/firebase');



// Remove these lines as they're now redundant
// const serviceAccount = require(path.join(__dirname, '../../config/serviceAccountKey.json'));
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'gs://hilight-7a75a.appspot.com'
// });
// const db = admin.firestore();

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