import mongoose from "mongoose"
import config from "./config.js"

const options = { serverSelectionTimeoutMS: 10000, dbName: 'hirenest' }

const connectDB = async () => {
    try {
        const res = mongoose.connect(config.mongoDB_URL, options)
        if (!res) console.log('Error!')
        console.log('DB connected!')
    } catch (error) {
        console.error('DB Error : ' + error.message)
    }
}

export default connectDB 