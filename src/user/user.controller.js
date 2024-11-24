const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-admin");
const db = require("../db");

router.post("/register", async (req, res) => {
  const { uid, email, fullName } = req.body;

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

  const userSnapshot = await db.collection("users").doc(uid).get();
  if (userSnapshot.exists) {
    return res.status(400).json({
      message: "User already registered",
    });
  }

  await db.collection("users").doc(uid).set({
    email,
    full_name: fullName,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.status(201).json({
    message: "User created successfully",
    data: {
      uid: uid,
    },
  });
});

module.exports = router;
