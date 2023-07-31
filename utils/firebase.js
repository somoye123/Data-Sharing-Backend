import firebaseAdmin from 'firebase-admin';

// Set up firebase admin
const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64, 'base64').toString(
        'ascii',
      ),
    ),
  ),
});

export default firebaseApp;
