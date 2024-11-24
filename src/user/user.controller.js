const express = require("express");
const { isUserUidExists, getUserDataByUid } = require("./user.service");
const router = express.Router();

/**
 * GET USER BY UID
 * GET /users/:uid
 */
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists) {
      return res.status(404).json({
        message: `User with uid ${uid} does not exists`,
      });
    }

    const userData = await getUserDataByUid(uid);

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

module.exports = router;
