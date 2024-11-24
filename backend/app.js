const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const messageRoute = require("./routes/messages");
const { errorHandler } = require("./middlewares/error");
const verifyToken = require("./middlewares/verifyToken");
const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", verifyToken, authRoute);
app.use("/api/user", verifyToken, userRoute);
app.use("/api/post", verifyToken, postRoute);
app.use("/api/comment", verifyToken, commentRoute);
app.use("/api/messages", verifyToken, messageRoute);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("App is running...");
});
