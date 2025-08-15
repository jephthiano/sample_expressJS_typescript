import { Request } from 'express';
import { triggerError} from '#core_util/handler.util.js';
import { dbFindUnexpiredToken, dbDeleteToken, dbUpdateOrCeateToken, DbRenewToken } from '#database/mongo/token.db.js';
import { redisGetUserIdByToken, redisDeleteToken, redisCreateToken, redisRenewToken, } from '#database/redis/token.db.js';
import { createJwtToken, renewJwtToken, validateJwtToken } from '#service_util/validation/jwt.js';
import { extractCookieToken } from '#main_util/cookie.util.js';
import { getEnvorThrow } from '#src/utils/mains/general.util.js';

const TOKEN_SETTER = getEnvorThrow("TOKEN_SETTER");
const TOKEN_TYPE = getEnvorThrow("TOKEN_TYPE");

// Generate Token with expiration
const setApiToken = async (id: string) => {
    const token = await generateToken(id);

    return token ?? null;

};

const validateApiToken = async (req: Request) => {
    const token = getApiToken(req);
    if (!token) return false;
    
    let userId = null;

    if (TOKEN_SETTER === 'jwt') {
        userId = await validateJwtToken(token);
    } else if (TOKEN_SETTER === 'local_self') {
        userId = await dbFindUnexpiredToken(token);
    } else if (TOKEN_SETTER === 'redis_self') {
        userId = await redisGetUserIdByToken(token)
    } else {
        triggerError(`Unsupported Request`, [], 400);
    }
    
    if (userId) {
        // newToken if token will be changing at every request [or when  close to expre time]
        // const newToken = await autoRenewTokenTime(userId, token); 
        return userId;
    }

    return false;
    
};

const deleteApiToken = async (req: Request) => {
    let status = false;
    
    const token = getApiToken(req);
    if(!token) return false;

    if (TOKEN_SETTER === 'jwt') {
        status = true; // not available
    } else if (TOKEN_SETTER === 'local_self') {
        status = await dbDeleteToken(token)
    } else if (TOKEN_SETTER === 'redis_self') {
        status = await redisDeleteToken(token);
    }

    return status;
}


//get the token
const getApiToken = (req: Request) => {
    const token = TOKEN_TYPE === 'bearer' 
                    ? extractBearerToken(req) 
                    : extractCookieToken(req);

    return token ?? null;
}

// Extract token from headers (Bearer Token)
const extractBearerToken = (req: Request): string | null => {
    const authHeader: string|undefined = req.headers.authorization

  if (authHeader && typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.split(' ')[1] || null;
    return token;
  }
  return null;
};


const generateToken = async (
  userId: string
): Promise<
    ReturnType<typeof createJwtToken> |
    ReturnType<typeof dbUpdateOrCeateToken> |
    ReturnType<typeof redisCreateToken> |
    null
> => {
    const methods: Record<string, () => Promise<any>> = {
        jwt: () => createJwtToken(userId),
        local_self: () => dbUpdateOrCeateToken(userId),
        redis_self: () => redisCreateToken(userId),
    };

    const method = TOKEN_SETTER ?? '';
    const selectedMethod = methods[method];

    if (!selectedMethod) return null; 

    return await selectedMethod();
};



const autoRenewTokenTime = async (
  userId: string,
  token: string
): Promise<
    ReturnType<typeof renewJwtToken> | 
    ReturnType<typeof DbRenewToken> | 
    ReturnType<typeof redisRenewToken> | 
    null
> => {
    const methods: Record<string, () => Promise<any>> = {
        jwt: () => renewJwtToken(token),
        local_self: () => DbRenewToken(userId),
        redis_self: () => redisRenewToken(userId, token),
    };

    const method = TOKEN_SETTER ?? '';
    const selectedMethod = methods[method];

    if (! selectedMethod) return null;

    return await selectedMethod();

};


export {
    getApiToken,
    setApiToken,
    validateApiToken,
    deleteApiToken,
};