const admin = require("../config/firebase-admin");

const bucket = admin.storage().bucket();

module.exports = bucket;
