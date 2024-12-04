const uploadImage = require("../utils/uploadImage");
const deleteImage = require("../utils/deleteImage");

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

  if (postData.user) {
    const userSnapshot = await postData.user.get();
    if (userSnapshot.exists) {
      _temp = userSnapshot.data();
      postData.user = {
        id: userSnapshot.id,
        fullName: _temp.full_name,
      };
    } else {
      postData.user = null;
    }
  }

  if (postData.likes && Array.isArray(postData.likes)) {
    const likesSnapshots = await Promise.all(
      postData.likes.map((ref) => ref.get())
    );
    postData.likes = likesSnapshots
      .filter((snapshot) => snapshot.exists)
      .map((snapshot) => snapshot.id);
  }

  if (postData.dislikes && Array.isArray(postData.dislikes)) {
    const dislikesSnapshot = await Promise.all(
      postData.dislikes.map((ref) => ref.get())
    );
    postData.dislikes = dislikesSnapshot
      .filter((snapshot) => snapshot.exists)
      .map((snapshot) => snapshot.id);
  }

  if (postData.created_at) {
    postData.created_at = postData.created_at.toDate().toISOString();
  }

  return postData;
};

// === CREATE SERVICES =======

const createPost = async (post) => {
  const { uid } = post;
  const userRef = await getUserRef(uid);

  const image_url = await uploadImage(post.image);

  const newPost = {
    userRef,
    title: post.title,
    description: post.description,
    image_url,
  };

  await createNewPost(newPost);
};

// === UPDATE SERVICES =======

const updatePost = async (postId, post) => {
  let image_url = "";
  if (post.image) {
    let currentPost = await getPostRefById(postId);
    currentPost = await currentPost.get();
    currentPost = await currentPost.data();
    const oldImageUrl = currentPost?.image_url;

    if (oldImageUrl) {
      await deleteImage(oldImageUrl);
    }

    image_url = await uploadImage(post.image);
  }

  const newPost = {
    title: post.title,
    description: post.description,
    image_url,
  };

  await updatePostById(postId, newPost);
};

// === DELETE SERVICES =======

const deletePost = async (postId) => {
  let currentPost = await getPostRefById(postId);
  currentPost = await currentPost.get();
  currentPost = await currentPost.data();
  const oldImageUrl = currentPost?.image_url;

  if (oldImageUrl) {
    await deleteImage(oldImageUrl);
  }

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
    const dislikes = postData.dislikes || [];
    const userIndex = dislikes.findIndex((ref) => ref.path === userRef.path);
    if (userIndex !== -1) dislikes.splice(userIndex, 1);

    likes.push(userRef);
  } else {
    likes.splice(userIndex, 1);
  }

  await updatePostById(postId, postData);
};

const dislikePost = async (postId, uid) => {
  const userRef = await getUserRef(uid);

  const postRef = await getPostRefById(postId);
  const postSnapshot = await postRef.get();
  const postData = postSnapshot.data();

  const dislikes = postData.dislikes || [];
  const userIndex = dislikes.findIndex((ref) => ref.path === userRef.path);
  if (userIndex === -1) {
    const likes = postData.likes || [];
    const userIndex = likes.findIndex((ref) => ref.path === userRef.path);
    if (userIndex !== -1) likes.splice(userIndex, 1);

    dislikes.push(userRef);
  } else {
    dislikes.splice(userIndex, 1);
  }

  await updatePostById(postId, postData);
};

module.exports = {
  isPostIdExists,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
};
