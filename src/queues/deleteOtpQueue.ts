import { Queue } from 'bullmq';
import { redis } from '#config/redis.js'; 

const deleteOtpQueue = new Queue('deleteOtpQueue', {
  connection: redis.duplicate(), // ensures a clean connection for the Queue
});

/**
 * Adds job to the rehash queue.
 *
 * @param {Object} data - The message payload.
 */
async function queueDeleteOtp(data) {
  await deleteOtpQueue.add('deleteOtp', { data });
}

export { queueDeleteOtp };