const db = require("../db");

// === READ OPERATIONS =======

const getAllPostsRef = async (page, limit) => {
  const postsRef = await db
    .collection("posts")
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset((page - 1) * limit);
  return postsRef;
};

const getPostRefById = async (postId) => {
  const postRef = await db.collection("posts").doc(postId);
  return postRef;
};

// === CREATE OPERATIONS =======

const createNewPost = async (post) => {
  const { userRef, title, description, image_url } = post;
  const postRef = await db.collection("posts").add({
    user: userRef,
    image_url,
    title,
    description,
    likes: [],
    dislikes: [],
    created_at: new Date(),
  });

  postRef.collection("comments");
};

// === UPDATE OPERATIONS =======

const updatePostById = async (postId, post) => {
  const postRef = await db.collection("posts").doc(postId);
  await postRef.update(post);
};

// === DELETE OPERATIONS =======

const deletePostById = async (postId) => {
  const postRef = await db.collection("posts").doc(postId);
  await postRef.delete();
};

module.exports = {
  getAllPostsRef,
  getPostRefById,
  createNewPost,
  updatePostById,
  deletePostById,
};
