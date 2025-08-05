import { Queue } from 'bullmq';
import { redis } from '#config/redis.js'; 

const rehashQueue = new Queue('rehashQueue', {
  connection: redis.duplicate(), // ensures a clean connection for the Queue
});

/**
 * Adds job to the rehash queue.
 *
 * @param {Object} data - The message payload.
 */
async function queueRehash(data) {
  await rehashQueue.add('rehashPassword', { data });
}

export { queueRehash };