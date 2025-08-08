interface UpdateOtpType {
  receiving_medium: string;
  use_case: 'signup' | 'forgot_password';
  code: string;
}

interface SendOtpType extends UpdateOtpType {
  send_medium: 'email' | 'whatsapp' | 'sms' | 'push_notification';
}

export { SendOtpType, UpdateOtpType };
