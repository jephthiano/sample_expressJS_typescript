import jwt, { JwtPayload } from 'jsonwebtoken';
import { getEnvorThrow } from '#src/utils/mains/general.util.js';
import { triggerError } from '#src/utils/cores/handler.util.js';

const tokenExpiry = getEnvorThrow('TOKEN_EXPIRY') ; // default to 1 hour
const jwtSecret = getEnvorThrow('JWT_SECRET_KEY');
const threshold = getEnvorThrow('THRESHOLD');


const createJwtToken = async (userId: string) => {
    const token = jwt.sign(
        { userId },
        jwtSecret,
        { expiresIn: parseInt(tokenExpiry) }// in seconds
    );

    return token ?? null;
}

const renewJwtToken = async (token: string): Promise<string> => {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const userId = decoded.id as string | undefined;
    if (!userId) triggerError('Error occurred on the server', [], 500);

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    const timeLeft = (decoded.exp ?? 0) - now;

    // Threshold should be a number representing seconds before expiry to renew
    return timeLeft <= parseInt(threshold) ? createJwtToken(userId) : token;

};

const validateJwtToken = async (token: string): Promise<string | null> => {

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload | string;

    if (typeof decoded === 'string') return null;

    return decoded.userId ?? null;


};


export {
    createJwtToken,
    renewJwtToken,
    validateJwtToken,
 }