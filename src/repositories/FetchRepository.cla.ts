import { findUserByID } from '#database/mongo/user.db.js';

class FetchRepository
{
    static async getUserById(userId) {
        return await findUserByID(userId);
    }
}

export default FetchRepository;