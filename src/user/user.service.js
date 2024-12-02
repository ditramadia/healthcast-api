const {
  getUserByUid,
  getUserByEmail,
  createUser,
  updateUserByUid,
} = require("./user.repository");

// === VALIDATION SERVICES =======

const isUserUidExists = async (uid) => {
  const userRef = await getUserByUid(uid);
  const userSnapshot = await userRef.get();
  return userSnapshot.exists;
};

const isUserEmailExists = async (email) => {
  const userRef = await getUserByEmail(email);
  const userSnapshot = await userRef.get();
  return userSnapshot.exists;
};

// === READ SERVICES =======

const getUserRef = async (uid) => {
  const userRef = await getUserByUid(uid);
  return userRef;
};

const getUserData = async (uid) => {
  const userData = (await (await getUserByUid(uid)).get()).data();
  if (userData.created_at) {
    userData.created_at = userData.created_at.toDate().toISOString();
  }
  return userData;
};

// === CREATE SERVICES =======

const createNewUser = async (user) => {
  await createUser(user);
};

// === UPDATE SERVICES =======

const updateUserData = async (uid, newData) => {
  await updateUserByUid(uid, newData);
};

module.exports = {
  isUserUidExists,
  isUserEmailExists,
  getUserRef,
  createNewUser,
  getUserData,
  updateUserData,
};
