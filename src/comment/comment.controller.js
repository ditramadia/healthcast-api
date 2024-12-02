const express = require("express");
const { isPostIdExists } = require("../post/post.service");
const { getComments } = require("../comment/comment.servie");
const router = express.Router({ mergeParams: true });

/**
 * GET ALL COMMENTS
 * GET /post/:id/comments
 */
router.get("/", async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  console.log("params", req.params);

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

module.exports = router;
