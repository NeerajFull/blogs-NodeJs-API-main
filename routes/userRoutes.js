const express = require("express");
const { getAllUsers, registerController, loginController } = require("../controllers/userControllers");

const router = express.Router();


//get all users
router.get("/all-users", getAllUsers);

//create user or register user
router.post("/register", registerController);

//login user
router.post("/login", loginController)



module.exports = router