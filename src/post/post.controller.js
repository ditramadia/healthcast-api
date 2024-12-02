const express = require("express");
const {
  isPostIdExists,
  getPosts,
  getPost,
  createPost,
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

    const isUserExists = await isUserUidExists(uid);
    if (!isUserExists) {
      return res.status(404).json({
        message: `User with uid ${uid} does not exist`,
      });
    }

    if (!title)
      return res.status(400).json({
        message: "Missing required field: Title",
      });

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

/*
Edit Post by id
PUT /posts/:id
*/
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { title, description, image_url } = req.body;
//   try {
//     const isPostExists = await isPostIdExists(id);
//     if (!isPostExists) {
//       return res.status(404).json({
//         message: `Post with id ${id} does not exists`,
//       });
//     }
//     await updatePost(id, { title, description, image_url });
//     res.status(200).json({
//       message: "Post updated successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating post",
//       error: error.message,
//     });
//   }
// });
/*
Delete Post by id
DELETE /posts/:id
*/
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const isPostExists = await isPostIdExists(id);
//     if (!isPostExists) {
//       return res.status(404).json({
//         message: `Post with id ${id} does not exists`,
//       });
//     }
//     await deletePost(id);
//     res.status(200).json({
//       message: "Post deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error deleting post",
//       error: error.message,
//     });
//   }
// });
/*
Like post
PUT /posts/:id/likes

Dislike post
PUT /posts/:id/dislikes

Get all comments
GET /posts/:id/comments
*/
// router.get("/:id/comments", async (req, res) => {
//   const { id } = req.params;
//   const { page = 1, limit = 5 } = req.query;
//   try {
//     const isPostExists = await isPostIdExists(id);
//     if (!isPostExists) {
//       return res.status(404).json({
//         message: `Post with id ${id} does not exists`,
//       });
//     }
//     const comments = await getComments(id, page, limit);
//     res.status(200).json({
//       message: "Comments retrieved successfully",
//       data: comments,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error retrieving comments",
//       error: error.message,
//     });
//   }
// });

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
/*
Like comment
PUT /posts/:id/comments/:id/likes

Dislike comment
PUT /posts/:id/comments/:id/dislikes
*/
