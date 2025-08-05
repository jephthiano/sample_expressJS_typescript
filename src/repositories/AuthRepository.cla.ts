import { findUserByEmailOrPhone, createUserAccount, resetUserPaswword } from '#database/mongo/user.db.js';

class AuthRepository
{

    static async getUserByLoginId(loginId) {
        return await findUserByEmailOrPhone(loginId);
    }

    static async createUser(data) {
        return await createUserAccount(data);
    }

    static async updatePassword(data){
        return await resetUserPaswword(data);
    }
}

export default AuthRepository;