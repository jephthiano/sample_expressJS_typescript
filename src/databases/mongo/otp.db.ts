import Otp from '#src/models/Otp.schema.js';
import { createOtpDTO } from '#dto/otp.dto.js';
import { selEncrypt }  from '#main_util/security.util.js';
import type { StoreOtpInterface, UpdateOtpInterface } from '#src/types/otp/interface.js';

//FIND ONE OTP DATA
const findOneOtpData = async(receiving_medium: string, use_case: string, status: string)=> {
    receiving_medium = selEncrypt(receiving_medium, 'receiving_medium');
    // Look for the OTP record based on receiving medium, use case, and status
    return await Otp.findOne({ receiving_medium, use_case,  status });
}

// STORE OTP
const storeOtp = async (data: StoreOtpInterface): Promise<boolean> => {
    let result = null;

    const otpData = createOtpDTO(data);
    const { receiving_medium, code, use_case } = otpData;

    result = await Otp.findOneAndUpdate(
        { receiving_medium: selEncrypt(receiving_medium, 'receiving_medium') },
        { code, use_case, status: 'new' },
        { new: true }
    );

    // Insert new OTP if update failed
    if (!result) result = await Otp.create(otpData);
    
    return !!result;
};

// UPDATE OTP
const updateOtpStatus = async (data: UpdateOtpInterface): Promise<boolean> => {
    const otpData = createOtpDTO(data);
    const { receiving_medium, use_case } = otpData;
    
    return !!await Otp.findOneAndUpdate(
        { receiving_medium: selEncrypt(receiving_medium, 'receiving_medium'), use_case },
        { status: 'used' },
        { new: true }
    ); //convert value into boolean 
};

const deleteManyOtp = async (receiving_medium: string) : Promise<boolean> => {
    return !!await Otp.deleteMany({ receiving_medium: selEncrypt(receiving_medium, 'receiving_medium') }); //convert value into boolean
}

export { findOneOtpData, storeOtp, updateOtpStatus, deleteManyOtp, };
