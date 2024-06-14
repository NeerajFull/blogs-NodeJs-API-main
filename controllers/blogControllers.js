
const { mongoose } = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

const getAllBlogs = async (req, res) => {
    try {

        const blogs = await blogModel.find({}).populate("user", "username _id").sort({ '_id': -1 });
        if (!blogs) {
            return res.status(404).send({
                success: false,
                message: "No Blog Found"
            })
        }
        if (blogs.length > 0) {
            return res.status(200).send({
                success: true,
                blogCount: blogs.length,
                message: "All blogs",
                blogs
            })
        }

        return res.status(200).send({
            success: true,
            message: "No Blogs Found",
            blogCount: blogs.length,
            blogs
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting blogs",
            error
        })
    }
}


const createBlogController = async (req, res) => {
    try {
        const id = req.params.userId;
        const { title, description, image } = req.body;
        if (!title || !description || !image) {
            return res.status(400).send({
                success: false,
                message: "Please Provide all fields"
            })
        }
        const isUser = await userModel.findById(id);
        if (!isUser) {
            return res.status(404).send({
                success: false,
                message: "User does not exist"
            })
        }

        const newBlog = new blogModel({
            title,
            description,
            image,
            user: id
        });
        //save blog in Blog DB
        const savedBlog = await newBlog.save();
        const blog = await savedBlog.populate("user");
        // add blog into user account
        await userModel.findByIdAndUpdate(id, { blogs: [...isUser.blogs, newBlog._id] }, { new: true })

        return res.status(201).send({
            success: true,
            message: "Blog Created",
            data: {
                blog: blog
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while creating blog",
            error
        })
    }
}

const deleteBlogController = async (req, res) => {
    try {
        const id = req.params.blogId;
        const blog = await blogModel.findByIdAndDelete(id, { new: true }).populate("user");

        if (!blog) {
            return res.status(400).send({
                success: false,
                message: "Blog not found",
            })
        }

        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            success: true,
            message: "Blog Deleted",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting blog",
            error
        })
    }
}

const updateBlogController = async (req, res) => {
    try {
        const id = req.params.blogId;
        const { image, description, title } = req.body;
        if (!image || !description || !title) {
            return res.status(400).send({
                success: false,
                message: "Please Provide all fields"
            })
        }

        const blog = await blogModel.findByIdAndUpdate(id, { ...req.body }, { new: true }).populate("user");
        if (!blog) {
            return res.status(400).send({
                success: false,
                message: "Blog not found",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Blog Updated",
            data: {
                blog
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while updating blog",
            error
        })
    }
}


const getBlogByIdController = async (req, res) => {
    try {
        const id = req.params.blogId;
        const blog = await blogModel.findById(id);

        if (!blog) {
            return res.status(400).send({
                success: false,
                message: "Blog not found",
            })
        }
        return res.status(200).send({
            success: true,
            message: "Got a Blog",
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting a blog",
            error
        })
    }
}

const userBlogController = async (req, res) => {
    try {
        const id = req.params.userId;
        const blogs = (await blogModel.find({ user: id }).populate("user").sort({ "_id": -1 }));
        if (!blogs) {
            return res.status(400).send({
                success: false,
                message: "Blogs not found",
            });
        }
        return res.status(200).send({
            success: true,
            message: "User Blogs",
            data: {
                blogsCount: blogs.length,
                blogs
            }

        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while getting user blogs",
            error
        })
    }
}

const likeAndDislikeController = async (req, res) => {
    try {
        const { postId, userId } = req.body;
        const blog = await blogModel.findById(postId);

        if (!blog) {
            return res.status(400).send({
                success: false,
                message: "Blog not found",
            })
        }

        const likes = (blog.likedBy.includes(userId) ? blog.likedBy.filter((like) => like != userId) : [...blog.likedBy, userId]);

        const blogs = await blogModel.findByIdAndUpdate(postId, {
            likedBy: likes
        }, { new: true });

        if (blogs) {
            return res.status(200).send({
                success: true,
                message: `You liked the post`,
                data: { likedBy: blogs.likedBy }
            })
        }

        return res.status(400).send({
            success: false,
            message: `Like is not updated`,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while like or dislike action",
            error
        })
    }

}

module.exports = { userBlogController, getAllBlogs, createBlogController, updateBlogController, deleteBlogController, getBlogByIdController, likeAndDislikeController };