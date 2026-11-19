import mongoose from "mongoose";

export const connectDB = async () => {
    if (!process.env.MONGO_DBurl) {
        throw new Error("MONGO_DBurl is not configured");
    }

    await mongoose.connect(process.env.MONGO_DBurl);
    console.log("DB Connected");
}
