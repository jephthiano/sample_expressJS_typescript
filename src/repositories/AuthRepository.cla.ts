import { findUserByEmailOrPhone, createUserAccount, resetUserPaswword } from '#database/mongo/user.db.js';
import type  { UserDocument } from '#src/types/user/interface.js';
import type  { RegsiterRevampInterface, SignupRevampInterface, ResetPasswordRevampInterface } from '#src/types/auth/interface.js';

class AuthRepository
{

    static async getUserByLoginId(loginId: string): Promise<UserDocument | null> {
        return await findUserByEmailOrPhone(loginId);
    }

    static async createUser(data: RegsiterRevampInterface | SignupRevampInterface): Promise<UserDocument | null> {
        return await createUserAccount(data);
    }

    static async updatePassword(data: ResetPasswordRevampInterface): Promise<null | UserDocument> {
        return await resetUserPaswword(data);
    }
}

export default AuthRepository;

