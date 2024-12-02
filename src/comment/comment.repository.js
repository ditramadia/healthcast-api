const getAllCommentsRef = async (postRef, page, limit) => {
  const commentsRef = await postRef
    .collection("comments")
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset((page - 1) * limit);
  return commentsRef;
};

module.exports = {
  getAllCommentsRef,
};
