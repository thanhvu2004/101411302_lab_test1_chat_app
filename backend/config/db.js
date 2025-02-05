const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
          "mongodb+srv://root:passW0rd@mycluster.i14yy.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster",
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }
        );
        console.log("MongoDB Connected");
        } catch (error) {
            console.error("MongoDB Connection Error:", error);
            process.exit(1);
        }
};

module.exports = connectDB;
