import { findUserByEmailOrPhone, createUserAccount, resetUserPaswword } from '#database/mongo/user.db.js';
import type  { CreateUserInterface, ResetPasswordInterface } from '#src/types/user/interface.js';

class AuthRepository
{

    static async getUserByLoginId(loginId: string) {
        return await findUserByEmailOrPhone(loginId);
    }

    static async createUser(data: CreateUserInterface) {
        return await createUserAccount(data);
    }

    static async updatePassword(data: ResetPasswordInterface){
        return await resetUserPaswword(data);
    }
}

export default AuthRepository;