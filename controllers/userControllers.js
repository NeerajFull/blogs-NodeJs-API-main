const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register user
const registerController = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).send({
                success: false,
                message: "Please fill all the fields"
            })
        }
        //existing user

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).send({
                success: false,
                message: "User already exist"
            })
        }
    
        // ------->>>hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        //save new user
        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();
        return res.status(201).send({
            success: true,
            message: "New User Created",
            user: newUser
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Register",
            error
        })
    }
}

//get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        console.log(req.user);
        return res.status(200).send({
            success: true,
            message: "All users",
            userCount: users.length,
            users
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in getting all users",
            error
        })
    }
}

//login user
const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(500).send({
            success: false,
            message: "Please fill all the fileds",
        });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        //user doesnot exist
        return res.status(500).send({
            success: false,
            message: "User does not exist, please register."
        })
    }
    //user exists
    //------> check password
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
        return res.status(500).send({
            success: false,
            message: "Invalid Email or password"
        })
    }

    const payload = {
        userId: user._id,
        username: user.username
    }
    const accessToken = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
    //send response
    return res.status(200).send({
        success: true,
        message: "Login Successfull",
        userId: user._id,
        accessToken
    })
}

module.exports = { getAllUsers, registerController, loginController };