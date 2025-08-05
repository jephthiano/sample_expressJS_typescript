import { Worker } from 'bullmq';
import { redis } from '#config/redis.js';
import { deleteOtp } from '#main_util/otp.util.js';
import { log } from '#main_util/logger.util.js';
const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');
// Create the worker
const worker = new Worker('deleteOtpQueue', async (job) => {
    // if (job.name === 'deleteOtp') { }// can be used to filter
    try {
        const data = job.data.data;
        await deleteOtp(data);
    }
    catch (err) {
        logInfo('REHASH WORKER', `Error rehashing password: ${err.message}`);
        throw err; // ensure BullMQ registers it as a failure
    }
}, {
    connection: redis.duplicate(), // ensure isolated connection
    // concurrency: 5, // optional
});
// Error handler
worker.on('failed', (job, err) => {
    logError('DELETE OTP WORKER', `❌ Job failed for deleteing otp: ${err.message}`);
});
worker.on('completed', (job) => {
    logInfo('DELETE OTP WORKER', `🎉 Job completed: ${job.id}`);
});
