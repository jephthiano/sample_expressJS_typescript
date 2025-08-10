import { findSingleValue } from '#database/mongo/general.db.js';
import User from '#model/User.schema.js';
import { selEncrypt, selDecrypt }  from '#main_util/security.util.js';
import { createUserDTO, updatePasswordDTO } from '#dto/user.dto.js';
import type { ModelName } from '#src/types/general/types.js';
import type { CreateUserInterface, ResetPasswordInterface, ResetPasswordResponseInterface, UserDocument } from '#src/types/user/interface.js';

const findUserByID = async (userId: string): Promise<UserDocument | null> => {
    return await User.findOne({ _id: userId});
}

const findUserByEmailOrPhone = async(receiving_medium: string): Promise<UserDocument | null> => {
    const enc_receiving_medium = selEncrypt(receiving_medium.toLowerCase(), 'email_phone');

    return await User.findOne(
            { $or: [{ mobile_number: enc_receiving_medium }, { email: enc_receiving_medium }] }
        );
}

const findEmailMobileNumberUsername = async ( email: string | null, mobile_number: string | null, username: string ): Promise<[boolean, boolean, boolean]> => {
    const processEmail = email ? selEncrypt(email, 'email') : '';
    const processPhone = mobile_number ? selEncrypt(mobile_number, 'mobile_number') : '';

    const results = await Promise.all([
        findSingleValue('User', 'email', processEmail, 'email'),
        findSingleValue('User', 'mobile_number', processPhone, 'mobile_number'),
        findSingleValue('User', 'username', selEncrypt(username, 'username'), 'username'),
    ]);

    // Convert each result to boolean, e.g. non-null means exists
    return results.map(item => !!item) as [boolean, boolean, boolean];
};



const findUserSingleValue = async (model: ModelName, checkField: string, checkValue: string, returnField: string): Promise<string | null> => {
    return await findSingleValue(model, checkField, checkValue, returnField);
}

const findUserSingleValuebyEncField = async (model: ModelName, checkField: string, checkValue: string, returnField: string):Promise<string | null> => {
    checkField = selEncrypt(checkValue, checkField);
    return await findSingleValue(model, checkField, checkValue, returnField);
}

const createUserAccount = async(data: CreateUserInterface): Promise<UserDocument | null> => {
    const userData = createUserDTO(data);
    return await User.create(userData);
}

const resetUserPaswword = async(data: ResetPasswordInterface): Promise<null | ResetPasswordResponseInterface> => {
    
        const updatePasswordData = updatePasswordDTO(data);
        
        const { password, receiving_medium } = updatePasswordData;
        const encMedium = selEncrypt(receiving_medium, 'email_phone');
        
        const user =  await User.findOneAndUpdate(
            {$or: [{ mobile_number: encMedium }, { email: encMedium }]},
            { password },
            { new: true }
        )  
        
        if(!user) return null;

        return {
            email: selDecrypt(user.email, 'email'),
            first_name: selDecrypt(user.first_name, 'first_name'),
        };
}

export {
    findUserByID,
    findUserByEmailOrPhone,
    findEmailMobileNumberUsername,
    findUserSingleValue,
    findUserSingleValuebyEncField,
    createUserAccount,
    resetUserPaswword
};