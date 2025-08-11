import { findUserByID } from '#database/mongo/user.db.js';
import type { UserDocument } from '#src/types/user/interface.js';

class FetchRepository
{
    static async getUserById(userId: string): Promise<UserDocument|null> {
        return await findUserByID(userId);
    }
}

export default FetchRepository;