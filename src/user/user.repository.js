const db = require("../db");

// === READ OPERATIONS ========

const getUserByUid = async (uid) => {
  const userRef = db.collection("users").doc(uid);
  return userRef;
};

const getUserByEmail = async (email) => {
  const userRef = await db.collection("users").where("email", "==", email);
  return userRef;
};

// === CREATE OPERATIONS ========

const createUser = async (user) => {
  const { uid, email, fullName } = user;
  await db.collection("users").doc(uid).set({
    email,
    full_name: fullName,
    created_at: new Date(),
  });
};

// === UPDATE OPERATIONS ========

const updateUserByUid = async (uid, user) => {
  const userRef = await db.collection("users").doc(uid);
  await userRef.update(user);
};

module.exports = {
  getUserByUid,
  getUserByEmail,
  createUser,
  updateUserByUid,
};
