import { Worker } from 'bullmq';
import { redis } from '#config/redis.js'; 
import { deleteOtp } from '#main_util/otp.util.js';
import { log } from '#main_util/logger.util.js';

const logInfo = (type: string, data: unknown) => log(type, data, 'info');
const logError = (type:string, data: unknown) => log(type, data, 'error');

// Create the worker
const worker = new Worker(
  'deleteOtpQueue',
  async (job) => {
    // if (job.name === 'deleteOtp') { }// can be used to filter

    try {
      const data = job.data.data;
      await deleteOtp(data);
    } catch (err) {
      if (err instanceof Error) {
        logInfo('REHASH WORKER', `Error deleting otp: ${err.message}`);
      } else {
        logInfo('REHASH WORKER', `Unknown error: ${String(err)}`);
      }
      throw err; // ensure BullMQ registers it as a failure
    }
  },
  {
    connection: redis.duplicate(), // ensure isolated connection
    // concurrency: 5, // optional
  }
);

// Error handler
worker.on('failed', (job, err) => {
  if (err instanceof Error) {
    logError('DELETE OTP WORKER', `❌ Job failed for deleting otp: ${err.message}`);
  } else {
    logError('DELETE OTP WORKER', `❌ Job failed: ${String(err)}`);
  }
});

worker.on('completed', (job) => {
  logInfo('DELETE OTP WORKER', `🎉 Job completed: ${job.id}`);
});