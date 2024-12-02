const { getPostRefById } = require("../post/post.repository");
const { getUserRef } = require("../user/user.service");
const {
  getAllCommentsRef,
  getCommentRefById,
  createNewComment,
  updateCommentById,
} = require("./comment.repository");

// === VALIDATION SERVICES =======

const isCommentIdExists = async (postId, commentId) => {
  const postRef = await getPostRefById(postId);

  const commentRef = await getCommentRefById(postRef, commentId);
  const commentSnapshot = await commentRef.get();
  return commentSnapshot.exists;
};

// === READ SERVICES =======

const getComments = async (postId, page, limit) => {
  const postRef = await getPostRefById(postId);
  const commentsRef = await getAllCommentsRef(postRef, page, limit);
  const commentsSnapshot = await commentsRef.get();
  const commentsData = [];

  for (const commentSnapshot of commentsSnapshot.docs) {
    const commentData = commentSnapshot.data();

    if (commentData.user) {
      const userSnapshot = await commentData.user.get();
      if (userSnapshot.exists) {
        _temp = userSnapshot.data();
        commentData.user = {
          id: userSnapshot.id,
          fullName: _temp.full_name,
        };
      } else {
        commentData.user = null;
      }
    }

    if (commentData.likes && Array.isArray(commentData.likes)) {
      const likesSnapshots = await Promise.all(
        commentData.likes.map((ref) => ref.get())
      );
      commentData.likes = likesSnapshots
        .filter((snapshot) => snapshot.exists)
        .map((snapshot) => snapshot.id);
    }

    if (commentData.dislikes && Array.isArray(commentData.dislikes)) {
      const dislikesSnapshot = await Promise.all(
        commentData.dislikes.map((ref) => ref.get())
      );
      commentData.dislikes = dislikesSnapshot
        .filter((snapshot) => snapshot.exists)
        .map((snapshot) => snapshot.id);
    }

    if (commentData.created_at) {
      commentData.created_at = commentData.created_at.toDate().toISOString();
    }

    commentsData.push({
      id: commentSnapshot.id,
      ...commentData,
    });
  }

  return commentsData;
};

// === CREATE SERVICES =======

const createComment = async (uid, postId, comment) => {
  const userRef = await getUserRef(uid);
  const postRef = await getPostRefById(postId);

  const newComment = {
    comment,
    user: userRef,
    likes: [],
    dislikes: [],
    created_at: new Date(),
  };
  await createNewComment(postRef, newComment);
};

// === ACTION SERVICES =======

const likeComment = async (postId, commentId, uid) => {
  const userRef = await getUserRef(uid);
  const postRef = await getPostRefById(postId);

  const commentRef = await getCommentRefById(postRef, commentId);
  const commentSnapshot = await commentRef.get();
  const commentData = commentSnapshot.data();

  const likes = commentData.likes || [];
  const userIndex = likes.findIndex((ref) => ref.path === userRef.path);
  if (userIndex === -1) {
    const dislikes = commentData.dislikes || [];
    const userIndex = dislikes.findIndex((ref) => ref.path === userRef.path);
    if (userIndex !== -1) dislikes.splice(userIndex, 1);

    likes.push(userRef);
  } else {
    likes.splice(userIndex, 1);
  }

  await updateCommentById(postRef, commentId, commentData);
};

const dislikeComment = async (postId, commentId, uid) => {
  const userRef = await getUserRef(uid);
  const postRef = await getPostRefById(postId);

  const commentRef = await getCommentRefById(postRef, commentId);
  const commentSnapshot = await commentRef.get();
  const commentData = commentSnapshot.data();

  const dislikes = commentData.dislikes || [];
  const userIndex = dislikes.findIndex((ref) => ref.path === userRef.path);
  if (userIndex === -1) {
    const likes = commentData.likes || [];
    const userIndex = likes.findIndex((ref) => ref.path === userRef.path);
    if (userIndex !== -1) likes.splice(userIndex, 1);

    dislikes.push(userRef);
  } else {
    dislikes.splice(userIndex, 1);
  }

  await updateCommentById(postRef, commentId, commentData);
};

module.exports = {
  isCommentIdExists,
  getComments,
  createComment,
  likeComment,
  dislikeComment,
};
