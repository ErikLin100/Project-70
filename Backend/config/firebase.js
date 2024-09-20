const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://hilight-7a75a.appspot.com'
});

const db = admin.firestore();

module.exports = { admin, db };