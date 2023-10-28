import mongoose from "mongoose"


let isConnected = false;// to check the connection

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URI) return console.log('MONGODB_URI is not defined')


    if (isConnected) return console.log('MONGODB_URI is not defined')

try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected= true;
    console.log("MongoDB Connected");
    
    
} catch (error) {
    console.log(error);
    
}

}