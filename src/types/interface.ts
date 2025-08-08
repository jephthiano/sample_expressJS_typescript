import { messageMediumType, sendMessageType } from "./types.js";

interface UpdateOtpInterface {
  receiving_medium: string;
  use_case: 'signup' | 'forgot_password';
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

export { 
    SendOtpInterface, 
    UpdateOtpInterface, 
    sendMessageInterface,
    htmlEmailInterface,
    CreateUserInterface, 
    ResetPasswordInterface 
};
