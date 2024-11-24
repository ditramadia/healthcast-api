const admin = require("../config/firebase-admin.js");

const db = admin.firestore();

module.exports = db;
