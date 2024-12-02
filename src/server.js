const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const authController = require("./auth/auth.controller");
const userController = require("./user/user.controller");
const postController = require("./post/post.controller");
const commentController = require("./comment/comment.controller");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", async (req, res) => {
  res.send("This is the API for HealthCast App");
});

app.use("", authController);
app.use("/users", userController);
app.use("/posts", postController);
app.use("/posts/:postId/comments", commentController);

app.listen(PORT, () => {
  console.log(`Express API running in port ${PORT}`);
});
