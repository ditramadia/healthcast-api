const {
  getUserByUid,
  getUserByEmail,
  createUser,
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

const getUserDataByUid = async (uid) => {
  const userSnapshot = await getUserByUid(uid);
  const userData = userSnapshot.data();
  if (userData.created_at) {
    userData.created_at = userData.created_at.toDate().toISOString();
  }
  return userData;
};

module.exports = {
  isUserUidExists,
  isUserEmailExists,
  createNewUser,
  getUserDataByUid,
};
