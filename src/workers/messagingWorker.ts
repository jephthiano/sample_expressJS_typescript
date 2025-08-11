import { Worker } from 'bullmq';
import { redis } from '#config/redis.js'; 
import { sendMessage } from '#main_util/messaging.util.js';
import { log } from '#main_util/logger.util.js';

const logInfo = (type: string, data: unknown) => log(type, data, 'info');
const logError = (type:string, data: unknown) => log(type, data, 'error');

// Create the worker
const worker = new Worker(
  'messagingQueue',
  async (job) => {
    try {
      await sendMessage(job.data.data);
    } catch (err) {
      if (err instanceof Error) {
        logInfo('MESSAGING WORKER', `Error sending message: ${err.message}`);
      } else {
        logInfo('MESSAGING WORKER', `Unknown error: ${String(err)}`);
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
    logError('MESSAGING WORKER', `❌ Job failed for ${job?.data?.data?.send_medium || 'unknown'}: ${err.message}`);
  } else {
    logError('MESSAGING WORKER', `❌ Job failed: ${String(err)}`);
  }
});

worker.on('completed', (job) => {
  logInfo('MESSAGING WORKER', `🎉 Job completed: ${job.id}`);
});