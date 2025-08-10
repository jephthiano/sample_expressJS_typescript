import { Document } from 'mongoose';
import type { otpUseCase } from '#src/types/otp/types.js';
import type { messageMediumType } from '#src/types/messaging/types.js';

interface UpdateOtpInterface {
  receiving_medium: string;
  use_case: otpUseCase;
  code: string;
};

interface SendOtpInterface {
  send_medium: messageMediumType;
  receiving_medium: string;
  use_case: otpUseCase;
  first_name: string;
};

interface StoreOtpInterface {
  send_medium?: messageMediumType;
  first_name?: string;
  receiving_medium: string;
  use_case: otpUseCase;
  code: string
};


interface OtpTokenDocument extends Document {
    code: string;
    receiving_medium: string;
    use_case:string,
    status: string,
    reg_date: Date;
}


export { 
    UpdateOtpInterface,
    SendOtpInterface, 
    StoreOtpInterface,
    OtpTokenDocument,
};
