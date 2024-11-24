const {
  getUserByUid,
  getUserByEmail,
  createUser,
} = require("./auth.repository");

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

module.exports = {
  isUserUidExists,
  isUserEmailExists,
  createNewUser,
};
