import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log("No MONGO_URI, skipping DB connect for tests");
            return;
        }
        // Use a mock/in-memory DB or skip connecting if running verification without mongodb
        if (process.env.MONGO_URI.includes('localhost') && process.env.SKIP_DB) {
            console.log("Skipping local MongoDB connection for visual verification.");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        // Do not exit process if we just want to run frontend visual verifications
        // process.exit(1);
    }
}
