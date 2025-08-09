type sendMessageType = 'welcome' | 'otp_code' | 'reset_password';

type messageMediumType = 'email' | 'whatsapp' | 'sms' | 'push_notification'

export { 
    sendMessageType, 
    messageMediumType, 
};