const db = require("../db");

const getUserByUid = async (uid) => {
  const userSnapshot = await db.collection("users").doc(uid).get();
  return userSnapshot;
};

const getUserByEmail = async (email) => {
  const userSnapshot = await db
    .collection("users")
    .where("email", "==", email)
    .get();
  return userSnapshot;
};

const createUser = async (user) => {
  const { uid, email, fullName } = user;
  await db.collection("users").doc(uid).set({
    email,
    full_name: fullName,
    created_at: new Date(),
  });
};

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
