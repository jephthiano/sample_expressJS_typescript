import { getEnvorThrow, isDateLapsed } from '#main_util/general.util.js';
import { generateUniqueId, verifyPassword } from '#main_util/security.util.js';
import { sendMessage } from '#main_util/messaging.util.js';
import { findOneOtpData, storeOtp, updateOtpStatus, deleteManyOtp }from '#database/mongo/otp.db.js';
import { triggerError} from '#core_util/handler.util.js';
import type { SendOtpInterface, UpdateOtpInterface } from '#src/types/otp/interface.js';
import type { sendMessageType } from '#src/types/messaging/types.js';

// SEND OTP
const sendOtp = async (data: SendOtpInterface): Promise<boolean> => {
    let response = false;
    const code: string = String(generateUniqueId(6));
    const otpData = { ...data, code };
    
    // Store OTP
    if (await storeOtp(otpData)) {
        // send code with otp [queue]
        const type: sendMessageType = 'otp_code';
        const messageData = {...data, code, type};
        sendMessage(messageData, 'queue');
        response = true;
    }

    return response;
};

// VERIFY OTP
const verifyNewOtp = async (data: UpdateOtpInterface): Promise<boolean> => {
    const otpExpiry = getEnvorThrow("OTP_EXPIRY");
    const { receiving_medium, use_case, code } = data;

    const otpRecord = await findOneOtpData(receiving_medium, use_case, 'new');

    if(!otpRecord) triggerError("Incorrect otp code", [], 401);
    
    const { code: dbCode, reg_date } = otpRecord;
    
    // Verify if the provided code matches the stored one
    const isOtpCorrect = await verifyPassword(code, dbCode);

    if(!isOtpCorrect) triggerError("Incorrect otp code", [], 401);

    // update otp status to used
    if(!await updateOtpStatus({ receiving_medium, use_case, code })) triggerError("Error occurred while running request", [], 500);
    
    // Check if the OTP has expired (300 seconds = 5 minutes)
    if(isDateLapsed(reg_date, parseInt(otpExpiry))) triggerError("Otp code has expired", []);

    return true;
};

const verifyUsedOtp = async (data: UpdateOtpInterface): Promise<boolean> => {
    const otpExpiry = getEnvorThrow("OTP_EXPIRY");
    const { receiving_medium, use_case, code } = data;

    const otpRecord = await findOneOtpData(receiving_medium, use_case, 'used');

    if(!otpRecord) triggerError("Invalid Request", [], 403);

    const { code: dbCode, reg_date } = otpRecord;

    // Verify if the provided code matches the stored one
    const isOtpCorrect = await verifyPassword(code, dbCode);

    if(!isOtpCorrect) triggerError("Incorrect otp code", [], 401);
    
    if(isDateLapsed(reg_date, parseInt(otpExpiry))) triggerError("Request timeout, try again", []);

    return true;
};

// DELETE OTP
const deleteOtp = async (receiving_medium: string): Promise<boolean> => {
    return deleteManyOtp(receiving_medium);
};

export {
    sendOtp,
    verifyNewOtp,
    verifyUsedOtp,
    deleteOtp,
};
