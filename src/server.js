const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

const HOST = process.env.HOST;
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  res.send("This is the API for HealthCast App");
});

app.listen(PORT, HOST, () => {
  console.log(`Express API running in http://${HOST}:${PORT}`);
});
