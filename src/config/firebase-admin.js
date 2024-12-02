const admin = require("firebase-admin");

const serviceAccount = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
