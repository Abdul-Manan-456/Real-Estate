const mongoose = require('mongoose');
mongoose.set('strictQuery', false)

const connectDB = async () => {
    try {
        const connt = await mongoose.connect(process.env.MONGO_URI);
        console.log('DataBase Connected Successfully');
    } catch (e) {
        console.log(e);
        console.error(e);
        process.exit(1);
    }
}

module.exports = { connectDB }