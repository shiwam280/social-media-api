const { CustomError } = require("../middlewares/error");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const createCommentController = async (req, res, next) => {
  const { postId, userId, text } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Post not found", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      text,
    });

    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment added to the post", comment: newComment });
  } catch (error) {
    next(error);
  }
};

const createCommentReplyController = async (req, res, next) => {
  const { commentId } = req.params;
  const { text, userId } = req.body;
  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      throw new CustomError("Parent comment not found!", 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const reply = {
      text,
      user: userId,
    };

    parentComment.replies.push(reply);
    await parentComment.save();
    res.status(201).json({ message: "Reply created successfully!", reply });
  } catch (error) {
    next(error);
  }
};

const populateUserDetails = async (comments) => {
  for (const comment of comments) {
    await comment.populate("user", "username fullName profilePicture");
    if (comment.replies.length > 0) {
      await comment.populate(
        "replies.user",
        "username fullName profilePicture"
      );
    }
  }
};

const getCommentsByPostController = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Post not found!", 404);
    }

    let comments = await Comment.find({ post: postId });

    await populateUserDetails(comments);

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

const deleteCommentController = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new CustomError("Comment not found!", 404);
    }

    await Post.findOneAndUpdate(
      { comments: commentId },
      { $pull: { comments: commentId } },
      { new: true }
    );

    await comment.deleteOne();
    res.status(200).json({ message: "Comment has been deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCommentController,
  createCommentReplyController,
  getCommentsByPostController,
  deleteCommentController,
};
