import { findUserByID } from '#database/mongo/user.db.js';
import { UserModelInterface } from '#src/types/user/interface.js';

class FetchRepository
{
    static async getUserById(userId: string): Promise<UserModelInterface|null> {
        return await findUserByID(userId);
    }
}

export default FetchRepository;