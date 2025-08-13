import { Document, ObjectId, Model } from 'mongoose';
import type { otpStatus, otpUseCase } from '#src/types/otp/types.js';
import type { messageMediumType } from '#src/types/messaging/types.js';

//fields needed to be created
interface OtpAttrs {
  receiving_medium: string;
  code: string;
  use_case: otpUseCase;
  status: otpStatus;
  reg_date?: Date;
}

interface OtpDocument extends OtpAttrs, Document {
  _id: ObjectId | string;
}

interface OtpModel extends Model<OtpDocument> {
  build(attrs: OtpAttrs): OtpDocument;
}


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
  first_name?: string;
  send_medium: messageMediumType;
  use_case: otpUseCase;
};

interface StoreOtpInterface extends VerifyOtpInputInterface{
  first_name?: string;
  send_medium?: messageMediumType;
  use_case: otpUseCase;
};

export { 
    OtpAttrs,
    SendOtpInputInterface,
    VerifyOtpInputInterface,
    UpdateOtpInterface,
    SendOtpInterface, 
    StoreOtpInterface,
};
