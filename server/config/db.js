import mongoose from "mongoose";
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        // @ts-ignore
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected');
    }
    catch (error) {
        console.log(`Error: ${error}`);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map