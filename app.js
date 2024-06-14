const express = require("express");
const connectDb = require("./database/db");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const session = require("express-session");
// const path = require("path");

const app = express();


app.use(express.json());
// app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Started at port ${PORT}`);
    //database connection
    connectDb();
}) 