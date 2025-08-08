interface UpdateOtpInterface {
  receiving_medium: string;
  use_case: 'signup' | 'forgot_password';
  code: string;
};

interface SendOtpInterface extends UpdateOtpInterface {
  send_medium: 'email' | 'whatsapp' | 'sms' | 'push_notification';
};

interface CreateUserInterface {
    receiving_medium?: string,
    code?: string,
    email?: string,
    mobile_number?: string,
    username: string,
    first_name: string,
    last_name: string,
    gender: string,
    password: string,
};

interface ResetPasswordInterface {
    receiving_medium: string,
    code: string,
    password: string,
    confirm_password: string,
}

export { 
    SendOtpInterface, 
    UpdateOtpInterface, 
    CreateUserInterface, 
    ResetPasswordInterface 
};
