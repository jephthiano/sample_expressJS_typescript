import { validateApiToken } from '#main_util/token.util.js';
import { handleException, triggerError } from '#core_util/handler.util.js';
import { findUserByID } from '#database/mongo/user.db.js';
// Middleware to verify token and attach user data to `req`
const tokenValidator = async (req, res, next) => {
    try {
        const userId = await validateApiToken(req);
        if (!userId)
            triggerError('Invalid request', [], 401);
        // Fetch user details 
        const user = await findUserByID(userId);
        //if user not found
        if (!user)
            triggerError('Invalid account', [], 401);
        if (user.status === 'suspended')
            triggerError('You have been suspended, contact admin', [], 401);
        // Attach data to request object
        req.user = user;
        next(); // Proceed to next middleware
    }
    catch (err) {
        handleException(res, err);
    }
};
export { tokenValidator };
