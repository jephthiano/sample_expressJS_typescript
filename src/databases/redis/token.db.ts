import { redis } from '#config/redis.js'; 
import { selEncrypt }  from '#main_util/security.util.js';
import { generateUniqueToken }  from '#main_util/security.util.js';

const tokenExpiry = parseInt(process.env.TOKEN_EXPIRY)
 
 const redisGetUserIdByToken = async (token) => {
   const encryptedToken = selEncrypt(token, 'token');
    const userId = await redis.get(`auth:token:${encryptedToken}`);

    return userId ?? null;
 }

 const redisCreateToken = async (userId) => {
      const newToken = generateUniqueToken();
      const encryptedToken = selEncrypt(newToken, 'token');
      
      // Use a pipeline for atomic operations
      const pipeline = redis.pipeline();

      // Get old token (outside pipeline because we need its value immediately)
      const oldToken = await redis.get(`auth:user:${userId}`);

      // If old token exists, queue its deletion
      if (oldToken) pipeline.del(`auth:token:${oldToken}`);

      // Set new mappings with expiration
      pipeline.set(`auth:user:${userId}`, encryptedToken, 'EX', tokenExpiry);
      pipeline.set(`auth:token:${encryptedToken}`, userId, 'EX', tokenExpiry);
      const results = await pipeline.exec();

      // Extract results for the last two commands (set operations)
      const setUserResult = results[results.length - 2]; // set auth:user:{userId}
      const setTokenResult = results[results.length - 1]; // set auth:token:{token}

      const userSetSuccess = setUserResult[1] === 'OK';
      const tokenSetSuccess = setTokenResult[1] === 'OK';

      return userSetSuccess && tokenSetSuccess ? newToken : null;
 };

 const redisRenewToken = async (userId, token) => {
   const encryptedToken = selEncrypt(token, 'token');
    const pipeline = redis.pipeline();

    pipeline.expire(`auth:token:${encryptedToken}`, tokenExpiry);
    pipeline.expire(`auth:user:${userId}`, tokenExpiry);
    const results = await pipeline.exec();

    const [tokenResult, userResult] = results;

    const tokenSuccess = tokenResult[1]; // 1 if TTL set successfully
    const userSuccess = userResult[1];

    return tokenSuccess === 1 && userSuccess === 1 ? true : false;
 };

 const redisDeleteToken = async (token) => {
    const encryptedToken = selEncrypt(token, 'token');
    const userId = await redis.get(`auth:token:${encryptedToken}`);
    
    if (userId) {
       const pipeline = redis.pipeline();

        pipeline.del(`auth:token:${encryptedToken}`);
        pipeline.del(`auth:user:${userId}`);
        const results = await pipeline.exec();

        // Check if both deletions were successful
        const [delTokenResult, delUserResult] = results;

        const delToken = delTokenResult[1]; // 1 = success, 0 = key not found
        const delUser = delUserResult[1];

        return delToken > 0 && delUser > 0;
    }

    return false; 
   };

 export {
    redisGetUserIdByToken,
    redisDeleteToken,
    redisCreateToken,
    redisRenewToken,
 }