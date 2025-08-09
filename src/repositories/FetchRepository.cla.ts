import { findUserByID } from '#database/mongo/user.db.js';
import { UserModelInterface } from '#src/types/user/interface.js';

class FetchRepository
{
    static async getUserById(userId: string): Promise<UserModelInterface|null> {
        const userDoc = await findUserByID(userId);
        return userDoc ? userDoc : null;
    }
}

export default FetchRepository;