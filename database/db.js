const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("CONNECTED TO DB");
    } catch (error) {
        console.log("MONGO CONNECTION ERROR", error);
    }
}

module.exports = connectDb;