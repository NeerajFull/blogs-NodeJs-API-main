const express = require("express");
const { getAllBlogs, createBlogController, updateBlogController, deleteBlogController, getBlogByIdController, userBlogController, likeAndDislikeController } = require("../controllers/blogControllers");
const { checkUser, isLogin } = require("../middlewares/authMiddleware");
const router = express.Router();

//get all blogs
router.get("/all-blogs", checkUser, getAllBlogs);

//create blogs
router.post("/create-blog/:userId", checkUser, createBlogController);

//update blog
router.put("/update-blog/:blogId", checkUser, updateBlogController);

//delete blog
router.delete("/delete-blog/:blogId", checkUser, deleteBlogController);

//get single Blog
router.get("/get-blog/:blogId", checkUser, getBlogByIdController);

//get user blog
router.get("/user-blog/:userId", checkUser, userBlogController);

//like or dislike blog
router.post("/like-dislike-user-blog", checkUser, likeAndDislikeController);

module.exports = router;