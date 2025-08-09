import { findUserByID } from '#database/mongo/user.db.js';

class FetchRepository
{
    static async getUserById(userId: string) {
        return await findUserByID(userId);
    }
}

export default FetchRepository;