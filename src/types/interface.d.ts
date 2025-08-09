import { Document } from 'mongoose';
import { messageMediumType, sendMessageType, otpUseCase } from "./types.ts";

interface UpdateOtpInterface {
  receiving_medium: string;
  use_case: otpUseCase;
  code: string;
};

interface SendOtpInterface extends UpdateOtpInterface {
  send_medium: messageMediumType;
};

interface sendMessageInterface {
    first_name: string;
    receiving_medium: string;
    send_medium: messageMediumType;
    type: sendMessageType;
    code?: string;
};

interface htmlEmailInterface {
    first_name: string;
    subject: string;
    text_content: string;
};

interface CreateUserInterface {
    receiving_medium?: string;
    code?: string;
    email?: string;
    mobile_number?: string;
    username: string;
    first_name: string;
    last_name: string;
    gender: string;
    password: string;
};

interface ResetPasswordInterface {
    receiving_medium: string;
    code: string;
    password: string;
    confirm_password: string;
}


interface OtpTokenDocument extends Document {
    code: string;
    receiving_medium: string;
    use_case:string,
    status: string,
    reg_date: Date;
}

interface TokenDocument extends Document {
    user_id: string;
    token: string;
    expire_at: Date;
    created_at: Date;
}


export { 
    SendOtpInterface, 
    UpdateOtpInterface, 
    sendMessageInterface,
    htmlEmailInterface,
    CreateUserInterface, 
    ResetPasswordInterface,
    OtpTokenDocument,
    TokenDocument,
};
