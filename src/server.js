const express = require("express");
const authController = require("./auth/auth.controller");
const userController = require("./user/user.controller");

const app = express();
app.use(express.json());

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  res.send("This is the API for HealthCast App");
});

app.use("", authController);
app.use("/users", userController);

app.listen(PORT, HOST, () => {
  console.log(`Express API running in http://${HOST}:${PORT}`);
});
