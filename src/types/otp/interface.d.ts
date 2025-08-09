import { Document } from 'mongoose';
import type { otpUseCase } from '#src/types/otp/types.js';
import type { messageMediumType } from '#src/types/messaging/types.js';

interface UpdateOtpInterface {
  receiving_medium: string;
  use_case: otpUseCase;
  code: string;
};

interface SendOtpInterface extends UpdateOtpInterface {
  send_medium: messageMediumType;
};

interface OtpTokenDocument extends Document {
    code: string;
    receiving_medium: string;
    use_case:string,
    status: string,
    reg_date: Date;
}


export { 
    SendOtpInterface, 
    UpdateOtpInterface,
    OtpTokenDocument,
};
