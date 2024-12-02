const express = require("express");
const {
  isPostIdExists,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
} = require("./post.service");
const { isUserUidExists } = require("../user/user.service");
const router = express.Router();

/**
 * GET ALL POSTS
 * GET /posts
 */
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await getPosts(page, limit);
    res.status(200).json({
      message: "Posts retrieved successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving posts",
      error: error.message,
    });
  }
});

/**
 * CREATE NEW POST
 * POST /posts
 */
router.post("/", async (req, res) => {
  // TODO: Use Multer to upload image instead of inserting the image_url in the body
  const { uid, title, description = "", image_url = "" } = req.body;

  try {
    if (!uid)
      return res.status(400).json({
        message: "Missing required field: Uid",
      });

    if (!title)
      return res.status(400).json({
        message: "Missing required field: Title",
      });

    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists) {
      return res.status(404).json({
        message: `User with uid ${uid} does not exist`,
      });
    }

    await createPost({ uid, title, description, image_url });
    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
});

/**
 * GET POST BY ID
 * GET /posts/:id
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const isPostExists = await isPostIdExists(id);
    if (!isPostExists) {
      return res.status(404).json({
        message: `Post with id ${id} does not exist`,
      });
    }

    const post = await getPost(id);
    res.status(200).json({
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving post",
      error: error.message,
    });
  }
});

/**
 * EDIT POST BY ID
 * PUT /posts/:id
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  // TODO: Use Multer to upload image instead of inserting the image_url in the body
  const { title, description = "", image_url = "" } = req.body;

  try {
    const isPostExists = await isPostIdExists(id);
    if (!isPostExists) {
      return res.status(404).json({
        message: `Post with id ${id} does not exist`,
      });
    }

    await updatePost(id, { title, description, image_url });

    res.status(200).json({
      message: "Post updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
});

/**
 * DELETE POST BY ID
 * DELETE /posts/:id
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const isPostExists = await isPostIdExists(id);
    if (!isPostExists) {
      return res.status(404).json({
        message: `Post with id ${id} does not exist`,
      });
    }

    await deletePost(id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
});

/**
 * LIKE/UNLIKE POST
 * PUT /posts/:id/like
 */
router.put("/:id/like", async (req, res) => {
  const { id: postId } = req.params;
  const { uid } = req.body;

  try {
    const isPostExists = await isPostIdExists(postId);
    if (!isPostExists) {
      return res.status(404).json({
        message: `Post with id ${postId} does not exist`,
      });
    }

    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists) {
      return res.status(404).json({
        message: `User with uid ${uid} does not exist`,
      });
    }

    await likePost(postId, uid);

    res.status(200).json({
      message: "Post liked/unliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error liking/unliking post",
      error: error.message,
    });
  }
});

/**
 * DISLIKE/UNDISLIKE POST
 * PUT /posts/:id/dislike
 */
router.put("/:id/dislike", async (req, res) => {
  const { id: postId } = req.params;
  const { uid } = req.body;

  try {
    const isPostExists = await isPostIdExists(postId);
    if (!isPostExists) {
      return res.status(404).json({
        message: `Post with id ${postId} does not exist`,
      });
    }

    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists) {
      return res.status(404).json({
        message: `User with uid ${uid} does not exist`,
      });
    }

    await dislikePost(postId, uid);

    res.status(200).json({
      message: "Post liked/unliked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error liking/unliking post",
      error: error.message,
    });
  }
});

// router.post("/:id/comments", async (req, res) => {
//   const { id } = req.params;
//   const { user, comment } = req.body;
//   try {
//     const isPostExists = await isPostIdExists(id);
//     if (!isPostExists) {
//       return res.status(404).json({
//         message: `Post with id ${id} does not exists`,
//       });
//     }
//     await createComment(id, { user, comment });
//     res.status(201).json({
//       message: "Comment created successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating comment",
//       error: error.message,
//     });
//   }
// });

module.exports = router;
