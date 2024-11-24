const express = require("express");
const router = express.Router();
const {
  isUserUidExists,
  isUserEmailExists,
  createNewUser,
} = require("../user/user.service");

/**
 * REGISTER
 * POST /register
 */
router.post("/register", async (req, res) => {
  const { uid, email, fullName } = req.body;
  try {
    if (!uid) {
      return res.status(400).json({
        message: "Missing required field: uid",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Missing required field: Email",
      });
    }

    if (!fullName) {
      return res.status(400).json({
        message: "Missing required field: Password",
      });
    }

    const isUidExists = await isUserUidExists(uid);
    if (isUidExists) {
      return res.status(400).json({
        message: "uid is already registered",
      });
    }

    const isEmailExists = await isUserEmailExists(email);
    if (isEmailExists) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    await createNewUser({ uid, email, fullName });

    res.status(201).json({
      message: "User created successfully",
      data: {
        uid: uid,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

module.exports = router;
