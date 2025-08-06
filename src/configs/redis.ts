import Redis from 'ioredis';
// import * as IORedis from 'ioredis';
import { log } from '#main_util/logger.util.js';

const logInfo = (type: string, data: string) => log(type, data, 'info');
const logError = (type: string, data: string) => log(type, data, 'error');

// Validate required env variables
const rawPort = process.env.REDIS_PORT;
const redisHost = process.env.REDIS_HOST;

if (!rawPort || !redisHost) {
    logError('REDIS', `Redis Port is not set`);
    throw new Error('Error occured on the server.');
}

const redisPort = Number(rawPort);
if (isNaN(redisPort)) {
    logError('REDIS', `Invalid REDIS_PORT value: ${rawPort}`);
    throw new Error('REDIS_PORT must be a valid number');
}

const redis = new Redis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
    // password: process.env.REDIS_PASSWORD, // Uncomment if using auth
});

logInfo('REDIS', `Connected to Redis at ${redisHost}:${redisPort}`);

export { redis };
