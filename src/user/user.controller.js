const express = require("express");
const upload = require("../middleware/multer");
const bucket = require("../db/bucket");
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
router.post("/:uid", upload.single("avatar"), async (req, res) => {
  const { uid } = req.params;
  const { fullName, gender, age } = req.body;
  const avatar = req.file;

  console.log("param", req.params);
  console.log("body:", req.body);
  console.log("file", req.file);

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

    let avatarUrl;
    if (avatar) {
      const date = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\./g, "-");
      const avatarName = `${avatar.originalname}-${date}`;
      const avatarUpload = bucket.file(avatarName);

      avatarUrl = await new Promise((resolve, reject) => {
        const stream = avatarUpload.createWriteStream({
          metadata: {
            contentType: avatar.mimetype,
          },
        });
        stream.on("error", (err) => {
          return res.status(500).json({
            message: "Error uploading profile picture",
          });
        });
        stream.on("finish", async () => {
          try {
            const [url] = await avatarUpload.getSignedUrl({
              action: "read",
              expires: "01-01-2030",
            });
            resolve(url);
          } catch (err) {
            reject(err);
          }
        });
        stream.end(req.file.buffer);
      });
    }

    const updatedProfile = {
      fullName,
    };
    if (gender) updatedProfile.gender = gender;
    if (age) updatedProfile.age = age;
    if (avatar) updatedProfile.avatar_url = avatarUrl;

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
