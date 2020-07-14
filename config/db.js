const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`MongoDB connected: ${connect.connection.host}`);

    } catch (error) {
        console.error(err);
        process.exit(1)
    }
}

module.exports = connectDB