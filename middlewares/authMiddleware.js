const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const checkUser = async (req, res, next) => {
    let token;
    let { authorization, Authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer") || Authorization && Authorization.startsWith("Bearer")) {
        try {
            token = authorization.split(" ")[1];
            const { userId } = jwt.verify(token, process.env.SECRET);
            req.user = await userModel.findById(userId).select("-password");
            next();
        } catch (error) {
            console.log(error);
            return res.status(400).send({
                success: false,
                message: "Unauthorised user"
            })
        }
    }
    if (!token) {
        return res.status(401).send({
            success: false,
            message: "Unauthorize User"
        })
    }
}

const isLogin = (req, res, next) => {

}

module.exports = { checkUser, isLogin };