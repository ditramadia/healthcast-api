const express = require("express");
const {
  isUserUidExists,
  getUserData,
  updateUserData,
} = require("./user.service");
const router = express.Router();

/**
 * GET USER PROFILE
 * GET /users/:uid
 */
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists) {
      return res.status(404).json({
        message: `User with uid ${uid} does not exist`,
      });
    }

    const userData = await getUserData(uid);

    res.status(200).json({
      message: `User with uid ${uid} retrieved successfully`,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving user with uid ${uid}`,
      error: error.message,
    });
  }
});

/**
 * EDIT USER PROFILE
 * POST /users/:uid
 */
router.post("/:uid", async (req, res) => {
  const { uid } = req.params;
  const { fullName, gender, age } = req.body;

  try {
    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists)
      return res.status(404).json({
        message: `User with uid ${uid} does not exist`,
      });

    if (!fullName)
      return res.status(400).json({
        message: "Missing required field: Full Name",
      });

    const updatedProfile = {
      fullName,
    };
    if (gender) updatedProfile.gender = gender;
    if (age) updatedProfile.age = age;

    await updateUserData(uid, updatedProfile);

    res.status(200).json({
      message: `User with uid ${uid} updated successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error updating user with uid ${uid}`,
      error: error.message,
    });
  }
});

module.exports = router;
