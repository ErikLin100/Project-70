const admin = require('firebase-admin');
const serviceAccount = require('path/to/your/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

exports.uploadFile = async (filePath, destination) => {
  await bucket.upload(filePath, {
    destination: destination,
  });
  return bucket.file(destination).publicUrl();
};

exports.saveProjectToFirestore = async (projectData) => {
  const docRef = await db.collection('projects').add(projectData);
  return docRef.id;
};

exports.saveClipToFirestore = async (clipData) => {
  const docRef = await db.collection('clips').add(clipData);
  return docRef.id;
};