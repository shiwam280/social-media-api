const express = require("express");
const {
  createCommentController,
  createCommentReplyController,
  getCommentsByPostController,
  deleteCommentController,
} = require("../controllers/commentController");
const router = express.Router();

//CREATE COMMENT
router.post("/create", createCommentController);

//CREATE COMMENT REPLY
router.post("/create/reply/:commentId", createCommentReplyController);

//GET ALL POST COMMENTS
router.get("/post/:postId", getCommentsByPostController);

//DELETE A COMMENT
router.delete("/delete/:commentId", deleteCommentController);

module.exports = router;
