const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("../src/routers/user");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(userRouter);

mongoose.connect("mongodb://127.0.0.1:27017/demo-ums", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.listen(port, () => {
  console.log("Server started on port", port);
});
