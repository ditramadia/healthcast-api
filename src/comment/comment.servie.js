const { getPostRefById } = require("../post/post.repository");
const { getAllCommentsRef } = require("./comment.repository");

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

module.exports = {
  getComments,
};
