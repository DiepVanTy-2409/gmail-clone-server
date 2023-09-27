import mongoose from "mongoose";

export async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('CONNECTED TO MONGODB!')
    } catch (error) {
        console.log(error)
    }
}