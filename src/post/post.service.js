const { post } = require("../auth/auth.controller");
const {
    getPostById,
    getPostComments,
    getAllPosts,
    getCommentById,
    createNewPost,
    createNewComment,
    updatePostById,
    deletePostById,
} = require("./post.repository");

const isPostIdExists = async (postId) => {
    const postSnapshot = await getPostById(postId);
    return postSnapshot.exists;
}

const getPosts = async (page, limit) => {
    const postsSnapshot = await getAllPosts(page, limit);
    const postsData = postsSnapshot.docs.map((doc) => {
        const data = doc.data();
  
        // Convert `created_at` to string if it exists
        if (data.created_at) {
          data.created_at = data.created_at.toDate().toISOString(); // Convert Firestore Timestamp to ISO string
        }
  
        return { id: doc.id, ...data }; // Include the document ID
    });
  
      return postsData;
};

const getPost = async (postId) => {
    const postSnapshot = await getPostById(postId);
    const postData = postSnapshot.data();
    if (postData.created_at) {
        postData.created_at = postData.created_at.toDate().toISOString();
    }
    return postData;
}

const getComments = async (postId, page, limit) => {
    const commentsSnapshot = await getPostComments(postId, page, limit);
    const commentsData = commentsSnapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.created_at) {
            data.created_at = data.created_at.toDate().toISOString();
        }
        return { id: doc.id, ...data };
    });
    return commentsData;
}

const getLikes = async (postId) => {
    const likesSnapshot = await getPostLikes(postId);
    return likesSnapshot.data();
}

const getDislikes = async (postId) => {
    const dislikesSnapshot = await getPostDislikes(postId);
    return dislikesSnapshot.data();
}

const createPost = async (post) => {
    // add like and dislike 0 to post
    post = {...post, likes: 0, dislikes: 0};
    await createNewPost(post);
}

const createComment = async (postId, comment) => {
    comment = {...comment, likes: 0, dislikes: 0};
    await createNewComment(postId, comment);
}

const updatePost = async (postId, post) => {
    await updatePostById(postId, post);
}

const deletePost = async (postId) => {
    await deletePostById(postId);
}

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
    getPosts,
    getPost,
    getComments,
    getLikes,
    getDislikes,
    createPost,
    createComment,
    updatePost,
    deletePost,
    isPostIdExists
    
};
