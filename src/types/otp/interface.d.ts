import { Document } from 'mongoose';
import type { otpUseCase } from '#src/types/otp/types.js';
import type { messageMediumType } from '#src/types/messaging/types.js';

interface SendOtpInputInterface {
  receiving_medium: string;
}

interface VerifyOtpInputInterface extends SendOtpInputInterface{
  code: string;
}



interface UpdateOtpInterface extends VerifyOtpInputInterface{
  use_case: otpUseCase;
};

interface SendOtpInterface extends SendOtpInputInterface{
  send_medium: messageMediumType;
  use_case: otpUseCase;
  first_name: string;
};

interface StoreOtpInterface extends VerifyOtpInputInterface{
  send_medium?: messageMediumType;
  first_name?: string;
  use_case: otpUseCase;
};


interface OtpTokenDocument extends Document {
    code: string;
    receiving_medium: string;
    use_case:string,
    status: string,
    reg_date: Date;
}


export { 
    SendOtpInputInterface,
    VerifyOtpInputInterface,
    UpdateOtpInterface,
    SendOtpInterface, 
    StoreOtpInterface,
    OtpTokenDocument,
};
