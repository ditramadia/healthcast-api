const express = require("express");
const upload = require("../middleware/multer");

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
const { getPostRefById } = require("./post.repository");
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
router.post("/", upload.single("image"), async (req, res) => {
  const { uid, title, description = "" } = req.body;
  const image = req.file;

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

    if (image && image.size > 1 * 1024 * 1024) {
      return res.status(400).json({
        message: "Image size exceeds the 1MB limit",
      });
    }

    const validMimeTypes = ["image/png", "image/jpeg"];
    if (image && !validMimeTypes.includes(image.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only PNG, JPEG, and JPG are allowed",
      });
    }

    await createPost({ uid, title, description, image });

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
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title, description = "" } = req.body;
  const image = req.file;

  try {
    if (image && image.size > 1 * 1024 * 1024) {
      return res.status(400).json({
        message: "Image size exceeds the 1MB limit",
      });
    }

    const validMimeTypes = ["image/png", "image/jpeg"];
    if (image && !validMimeTypes.includes(image.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only PNG, JPEG, and JPG are allowed",
      });
    }

    const isPostExists = await isPostIdExists(id);
    if (!isPostExists) {
      return res.status(404).json({
        message: `Post with id ${id} does not exist`,
      });
    }

    await updatePost(id, { title, description, image });

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

module.exports = router;
