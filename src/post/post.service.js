const {
  getAllPostsRef,
  getPostRefById,
  createNewPost,
  updatePostById,
  deletePostById,
} = require("./post.repository");
const { getUserRef } = require("../user/user.service");

// === VALIDATION SERVICES =======

const isPostIdExists = async (postId) => {
  const postRef = await getPostRefById(postId);
  const postSnapshot = await postRef.get();
  return postSnapshot.exists;
};

// === READ SERVICES =======

const getPosts = async (page, limit) => {
  const postsRef = await getAllPostsRef(page, limit);
  const postsSnapshot = await postsRef.get();
  const postsData = [];

  for (const postSnapshot of postsSnapshot.docs) {
    const postData = await getPost(postSnapshot.id);

    postsData.push({
      id: postSnapshot.id,
      ...postData,
    });
  }

  return postsData;
};

const getPost = async (postId) => {
  const postRef = await getPostRefById(postId);
  const postSnapshot = await postRef.get();
  const postData = postSnapshot.data();

  // Resolve the user reference to actual user data
  if (postData.user) {
    const userSnapshot = await postData.user.get();
    if (userSnapshot.exists) {
      _temp = userSnapshot.data();
      console.log(_temp);
      postData.user = {
        id: userSnapshot.id,
        fullName: _temp.fullName,
      };
    } else {
      postData.user = null;
    }
  }

  // Resolve the likes reference to acutal likes data
  if (postData.likes && Array.isArray(postData.likes)) {
    const likesSnapshots = await Promise.all(
      postData.likes.map((ref) => ref.get())
    );
    postData.likes = likesSnapshots
      .filter((snapshot) => snapshot.exists)
      .map((snapshot) => snapshot.id);
  }

  // Resolve the dislikes reference to acutal dislikes data
  if (postData.dislikes && Array.isArray(postData.dislikes)) {
    const dislikesSnapshot = await Promise.all(
      postData.dislikes.map((ref) => ref.get())
    );
    postData.dislikes = dislikesSnapshot
      .filter((snapshot) => snapshot.exists)
      .map((snapshot) => snapshot.id);
  }

  // Convert time stamp to ISO String
  if (postData.created_at) {
    postData.created_at = postData.created_at.toDate().toISOString();
  }

  return postData;
};

// === CREATE SERVICES =======

const createPost = async (post) => {
  const { uid } = post;
  const userRef = await getUserRef(uid);
  post.userRef = userRef;

  await createNewPost(post);
};

// === UPDATE SERVICES =======

const updatePost = async (postId, post) => {
  await updatePostById(postId, post);
};

// === DELETE SERVICES =======

const deletePost = async (postId) => {
  await deletePostById(postId);
};

// === ACTION SERVICES =======

const likePost = async (postId, uid) => {
  const userRef = await getUserRef(uid);

  const postRef = await getPostRefById(postId);
  const postSnapshot = await postRef.get();
  const postData = postSnapshot.data();

  const likes = postData.likes || [];
  const userIndex = likes.findIndex((ref) => ref.path === userRef.path);
  if (userIndex === -1) {
    likes.push(userRef);
  } else {
    likes.splice(userIndex, 1);
  }

  await updatePostById(postId, postData);
};

// const getComments = async (postId, page, limit) => {
//     const commentsSnapshot = await getPostComments(postId, page, limit);
//     const commentsData = commentsSnapshot.docs.map((doc) => {
//         const data = doc.data();
//         if (data.created_at) {
//             data.created_at = data.created_at.toDate().toISOString();
//         }
//         return { id: doc.id, ...data };
//     });
//     return commentsData;
// }

// const getLikes = async (postId) => {
//     const likesSnapshot = await getPostLikes(postId);
//     return likesSnapshot.data();
// }

// const getDislikes = async (postId) => {
//     const dislikesSnapshot = await getPostDislikes(postId);
//     return dislikesSnapshot.data();
// }

// const createComment = async (postId, comment) => {
//     comment = {...comment, likes: 0, dislikes: 0};
//     await createNewComment(postId, comment);
// }

// const LikeToPost = async (postId) => {
//     const postSnapshot = await getPostById(postId);
//     const post = postSnapshot.data();
//     post.likes = post.likes + 1;
//     await updatePostById(postId, post);
// }

// const DislikeToPost = async (postId) => {
//     const postSnapshot = await getPostById(postId);
//     const post = postSnapshot.data();
//     post.dislikes = post.dislikes + 1;
//     await updatePostById(postId, post);
// }

// const LikeToComment = async (postId, commentId) => {
//     const commentSnapshot = await getCommentById(postId, commentId);
//     const comment = commentSnapshot.data();
//     comment.likes = comment.likes + 1;
//     await updateCommentById(postId, commentId, comment);
// }

// const DislikeToComment = async (postId, commentId) => {
//     const commentSnapshot = await getCommentById(postId, commentId);
//     const comment = commentSnapshot.data();
//     comment.dislikes = comment.dislikes + 1;
//     await updateCommentById(postId, commentId, comment);
// }

// const removeLikeFromPost = async (postId) => {
//     const postSnapshot = await getPostById(postId);
//     const post = postSnapshot.data();
//     post.likes = post.likes - 1;
//     await updatePostById(postId, post);
// }

// const removeDislikeFromPost = async (postId) => {
//     const postSnapshot = await getPostById(postId);
//     const post = postSnapshot.data();
//     post.dislikes = post.dislikes - 1;
//     await updatePostById(postId, post);
// }

// const removeLikeFromComment = async (postId, commentId) => {
//     const commentSnapshot = await getCommentById(postId, commentId);
//     const comment = commentSnapshot.data();
//     comment.likes = comment.likes - 1;
//     await updateCommentById(postId, commentId, comment);
// }

// const removeDislikeFromComment = async (postId, commentId) => {
//     const commentSnapshot = await getCommentById(postId, commentId);
//     const comment = commentSnapshot.data();
//     comment.dislikes = comment.dislikes - 1;
//     await updateCommentById(postId, commentId, comment);
// }

module.exports = {
  isPostIdExists,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
