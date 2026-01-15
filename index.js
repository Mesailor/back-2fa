const express = require("express");
const app = express();
const userRouter = require("./routers/users");
const twofaMeddleware = require("./middlewares/twofa");

app.use(express.json());
app.use("/api/users", userRouter);

app.get("/", twofaMeddleware, (req, res) => {
  return res.send("Some information to authorised user");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
