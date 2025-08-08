import Redis from 'ioredis';
import { log } from '#main_util/logger.util.js';
import { getEnvorThrow } from '#src/utils/mains/general.util.js';

const logInfo = (type: string, data: string) => log(type, data, 'info');
const logError = (type: string, data: string) => log(type, data, 'error');

const rawPort = parseInt(getEnvorThrow("REDIS_PORT"));
const redisHost = getEnvorThrow("REDIS_HOST");

const redisPort = Number(rawPort);
if (isNaN(redisPort)) throw new Error('REDIS_PORT must be a valid number');

const redis = new Redis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
    // password: process.env.REDIS_PASSWORD, // Uncomment if using auth
});

logInfo('REDIS', `Connected to Redis at ${redisHost}:${redisPort}`);

export { redis };
