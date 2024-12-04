const bucket = require("../db/bucket");

const uploadImage = async (image) => {
  let imageUrl = "";

  const date = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-");
  const imageName = `${image.originalname}-${date}`;
  const imageUpload = bucket.file(imageName);

  imageUrl = await new Promise((resolve, reject) => {
    const stream = imageUpload.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });
    stream.on("error", (err) => {
      throw new Error("Error uploading avatar");
    });
    stream.on("finish", async () => {
      try {
        const [url] = await imageUpload.getSignedUrl({
          action: "read",
          expires: "01-01-2030",
        });
        resolve(url);
      } catch (err) {
        reject(err);
      }
    });
    stream.end(image.buffer);
  });

  return imageUrl;
};

module.exports = uploadImage;
