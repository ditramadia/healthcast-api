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

// const getPostComments = async (postId, page, limit) => {
// 	const commentsSnapshot = await db
// 		.collection("posts")
// 		.doc(postId)
// 		.collection("comments")
// 		.orderBy("created_at", "desc")
// 		.limit(limit)
// 		.offset((page - 1) * limit)
// 		.get();
// 	return commentsSnapshot;
// }

// const getCommentById = async (postId, commentId) => {
// 	const commentSnapshot = await db.collection("posts").doc(postId).collection("comments").doc(commentId).get();
// 	return commentSnapshot;
// }

// const getPostsByUserId = async (userId) => {
// 	const postsSnapshot = await db
// 		.collection("posts")
// 		.where("user_id", "==", userId)
// 		.get();
// 	return postsSnapshot;
// }

// const createNewComment = async (postId, commentMsg) => {
// 	const { user, comment, likes, dislikes} = commentMsg;
// 	const commentRef = await db.collection("posts").doc(postId).collection("comments").add({
// 		user,
// 		comment,
// 		likes,
// 		dislikes,
// 		created_at: new Date(),
// 	});
// }

// const updateCommentById = async (postId, commentId, comment) => {
// 	const commentRef = await db.collection("posts").doc(postId).collection("comments").doc(commentId);
// 	await commentRef.update(comment);
// }

// const deletePostById = async (postId) => {
// 	const postRef = await db.collection("posts").doc(postId);
// 	await postRef.delete();
// }

module.exports = {
  getAllPostsRef,
  getPostRefById,
  createNewPost,
  updatePostById,
};
