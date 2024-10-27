import mongoose from 'mongoose';
import { mongoDBURL } from "./config.js";

const dbConnect = async () => {
    await mongoose.connect(mongoDBURL);
}

export default dbConnect;