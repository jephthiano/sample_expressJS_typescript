import { findUserByEmailOrPhone, createUserAccount, resetUserPaswword } from '#database/mongo/user.db.js';
import type  { CreateUserInterface, ResetPasswordInterface, ResetPasswordResponseInterface, UserDocument } from '#src/types/user/interface.js';

class AuthRepository
{

    static async getUserByLoginId(loginId: string): Promise<UserDocument | null> {
        return await findUserByEmailOrPhone(loginId);
    }

    static async createUser(data: CreateUserInterface): Promise<UserDocument | null> {
        return await createUserAccount(data);
    }

    static async updatePassword(data: ResetPasswordInterface): Promise<null | ResetPasswordResponseInterface> {
        return await resetUserPaswword(data);
    }
}

export default AuthRepository;

