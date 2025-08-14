import Redis from 'ioredis';
import { log } from '#main_util/logger.util.js';
import { getEnvorThrow } from '#src/utils/mains/general.util.js';

const logInfo = (type: string, data: string) => log(type, data, 'info');
const logError = (type: string, data: string) => log(type, data, 'error');

const RAW_PORT = parseInt(getEnvorThrow("REDIS_PORT"));
const REDIS_HOST = getEnvorThrow("REDIS_HOST");
// const redisPassword = getEnvorThrow("REDIS_PASSWORD");

const REDIS_PORT = Number(RAW_PORT);
if (isNaN(REDIS_PORT)) throw new Error('REDIS_PORT must be a valid number');

const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null,
    // password: redisPassword, // Uncomment if using auth
});

logInfo('REDIS', `Connected to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

export { redis };
