// === READ OPERATIONS =======

const getAllCommentsRef = async (postRef, page, limit) => {
  const commentsRef = await postRef
    .collection("comments")
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset((page - 1) * limit);
  return commentsRef;
};

const getCommentRefById = async (postRef, commentId) => {
  const commentRef = await postRef.collection("comments").doc(commentId);
  return commentRef;
};

// === CREATE OPERATIONS =======

const createNewComment = async (postRef, newComment) => {
  await postRef.collection("comments").add(newComment);
};

// === UPDATE OPERATIONS =======

const updateCommentById = async (postRef, commentId, newComment) => {
  const commentRef = await postRef.collection("comments").doc(commentId);
  await commentRef.update(newComment);
};

module.exports = {
  getAllCommentsRef,
  getCommentRefById,
  createNewComment,
  updateCommentById,
};
