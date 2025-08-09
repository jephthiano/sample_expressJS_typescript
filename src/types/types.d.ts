type modelName = 'User' | 'OtpToken' | 'Token';

type otpUseCase = 'signup' | 'forgot_password';

type sendMessageType = 'welcome' | 'otp_code' | 'reset_password';

type messageMediumType = 'email' | 'whatsapp' | 'sms' | 'push_notification'

type UpdateHook = | 'findOneAndUpdate' | 'updateOne' | 'updateMany' | 'findByIdAndUpdate';

export { 
    modelName, 
    otpUseCase,
    sendMessageType, 
    messageMediumType, 
    UpdateHook };