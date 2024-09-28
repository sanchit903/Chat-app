import mongoose from "mongoose";

export const connect = async () => {
    await mongoose.connect('mongodb://localhost:27017/chatApp').then(() => {
        console.log('DB is connected');
    }).catch((error) => {
        console.log(error);
    });
}