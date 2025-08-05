import Redis from 'ioredis';
import { log } from '#main_util/logger.util.js';
const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');
// Safely parse and validate port
const rawPort = process.env.REDIS_PORT?.trim();
const redisPort = parseInt(rawPort, 10);
if (isNaN(redisPort)) {
    logError('REDIS', `Invalid REDIS_PORT value: ${process.env.REDIS_PORT}`);
    throw new Error('REDIS_PORT is not a valid number');
}
const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: redisPort,
    maxRetriesPerRequest: null,
    // password: process.env.REDIS_PASSWORD,
});
export { redis };
