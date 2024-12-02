const express = require("express");
const { isUserUidExists } = require("../user/user.service");
const { isPostIdExists } = require("../post/post.service");
const { getComments, createComment } = require("../comment/comment.servie");
const router = express.Router({ mergeParams: true });

/**
 * GET ALL COMMENTS
 * GET /post/:id/comments
 */
router.get("/", async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const isPostExists = await isPostIdExists(postId);
    if (!isPostExists) {
      return res.status(404).json({
        message: `Post with id ${postId} does not exist`,
      });
    }

    const comments = await getComments(postId, page, limit);

    res.status(200).json({
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving comments",
      error: error.message,
    });
  }
});

/**
 * CREATE NEW COMMENT
 * POST /post/:id/comments
 */
router.post("/", async (req, res) => {
  const { postId } = req.params;
  const { uid, comment } = req.body;

  try {
    if (!uid)
      return res.status(400).json({
        message: "Missing required field: Uid",
      });

    if (!comment)
      return res.status(400).json({
        message: "Missing required fields: Comment",
      });

    const isPostExists = await isPostIdExists(postId);
    if (!isPostExists)
      return res.status(404).json({
        message: `Post with id ${postId} does not exist`,
      });

    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists) {
      return res.status(404).json({
        message: `User with uid ${uid} does not exist`,
      });
    }

    await createComment(uid, postId, comment);

    res.status(200).json({
      message: "Comments created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating comments",
      error: error.message,
    });
  }
});

module.exports = router;
