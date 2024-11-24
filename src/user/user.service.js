const {
  getUserByUid,
  getUserByEmail,
  createUser,
  updateUserByUid,
} = require("./user.repository");

const isUserUidExists = async (uid) => {
  const userSnapshot = await getUserByUid(uid);
  return userSnapshot.exists;
};

const isUserEmailExists = async (email) => {
  const userSnapshot = await getUserByEmail(email);
  return !userSnapshot.empty;
};

const createNewUser = async (user) => {
  await createUser(user);
};

const getUserData = async (uid) => {
  const userSnapshot = await getUserByUid(uid);
  const userData = userSnapshot.data();
  if (userData.created_at) {
    userData.created_at = userData.created_at.toDate().toISOString();
  }
  return userData;
};

const updateUserData = async (uid, newData) => {
  await updateUserByUid(uid, newData);
};

module.exports = {
  isUserUidExists,
  isUserEmailExists,
  createNewUser,
  getUserData,
  updateUserData,
};
