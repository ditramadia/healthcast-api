const { getPostRefById } = require("../post/post.repository");
const { getUserByUid } = require("../user/user.repository");
const { getAllCommentsRef, createNewComment } = require("./comment.repository");

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
  const userRef = await getUserByUid(uid);
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

module.exports = {
  getComments,
  createComment,
};
