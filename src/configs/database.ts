import mongoose from 'mongoose';
import { log } from '#main_util/logger.util.js'; // adjust if your alias or path differs
import { getEnvorThrow } from '#src/utils/mains/general.util.js';


const logInfo = (type: string, data: string) => log(type, data, 'info');
const logError = (type: string, data: string) => log(type, data, 'error');

const connectDB = async () => {
    try {
        const MONGODB_URI = getEnvorThrow("MONGODB_URI");
        
        const conn = await mongoose.connect(MONGODB_URI);

        logInfo("DATABASE CONFIG", `✅ Database connected: ${conn.connection.host}`);
    } catch (err) {
        logError("DATABASE CONFIG", `❌ Error connecting to the database: ${err}`);
        process.exit(1);
    }
};

export { mongoose, connectDB };
