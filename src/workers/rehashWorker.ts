import { Worker } from 'bullmq';
import { redis } from '#config/redis.js'; 
import { updateSingleField } from '#database/mongo/general.db.js';
import { log } from '#main_util/logger.util.js';

const logInfo = (type: string, data: unknown) => log(type, data, 'info');
const logError = (type:string, data: unknown) => log(type, data, 'error');

// Create the worker
const worker = new Worker(
  'rehashQueue',
  async (job) => {
    try {
      const data = job.data.data
      await updateSingleField('User', 'id', data.userId, 'password', data.plainPassword);
    } catch (err) {
      if (err instanceof Error) {
        logInfo('REHASH WORKER', `Error rehashing password: ${err.message}`);
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
    logError('REHASH WORKER', `❌ Job failed for rehashing: ${err.message}`);
  } else {
    logError('REHASH WORKER', `❌ Job failed: ${String(err)}`);
  }
});

worker.on('completed', (job) => {
  logInfo('REHASH WORKER', `🎉 Job completed: ${job.id}`);
});