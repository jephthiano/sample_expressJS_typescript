import '#config/env.js';
import { connectDB, mongoose } from '#config/database.js'; // adjust if alias differs
import { log } from '#main_util/logger.util.js'; // same here

// Import workers — these will run once connected to DB
import '#worker/messagingWorker.js';
import '#worker/rehashWorker.js';
import '#worker/deleteOtpWorker.js';

// Connect DB and manage graceful shutdown
connectDB().then(() => {
    log('WORKER ENTRY POINT', '✅ Workers initialized and DB connected', 'info');

    process.on('SIGINT', async () => {
        log('WORKER ENTRY POINT', '🛑 Shutting down worker process...', 'error');
        await mongoose.disconnect();
        process.exit(0);
    });
});