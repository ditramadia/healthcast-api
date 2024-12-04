const bucket = require("../db/bucket");

const deleteImage = async (imageUrl) => {
  const imageName = imageUrl.split("?")[0].split("/").pop();
  const imageFile = bucket.file(imageName);

  await imageFile.delete().catch((err) => {
    throw new Error("Error deleting old image");
  });
};

module.exports = deleteImage;
