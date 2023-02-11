import mongoose from "mongoose"

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(process.env.MONGO_URI)
  } catch (error) {
    console.log(`Error: ${error}`)
    process.exit(1)
  }
}

export default connectDB