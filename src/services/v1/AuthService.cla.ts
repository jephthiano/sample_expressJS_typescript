import { Request } from 'express';
import AuthRepository from '#repository/AuthRepository.cla.js';
import FetchController from '#controller/v1/FetchController.cla.js';
import { verifyPassword, validateInput }  from '#main_util/security.util.js';
import { sendOtp, verifyNewOtp, verifyUsedOtp}  from '#main_util/otp.util.js';
import { queueDeleteOtp } from '#queue/deleteOtpQueue.js';
import { sendMessage } from '#main_util/messaging.util.js';
import { deleteApiToken } from '#main_util/token.util.js';
import { triggerError} from '#core_util/handler.util.js';
import type { messageMediumType } from '#src/types/messaging/types.js';
import type { otpUseCase } from '#src/types/otp/types.js';
import type { LoginRevampInterface, RegsiterRevampInterface, ResetPasswordRevampInterface, SendOtpRevampInterface, SignupRevampInterface, VerifyOtpRevampInterface, } from '#src/types/auth/interface.js';

class AuthService{

    // LOGIN
    static async login(inputData: LoginRevampInterface) {
        const { login_id, password } = inputData;

        // Get user data by login ID
        const user = await AuthRepository.getUserByLoginId(login_id);
        if (!user) triggerError("Incorrect login details", [], 401);

        // Verify password (async if using bcrypt.compare)
        const { password: dbPassword, status: userStatus, id: userId } = user;
        const  isPasswordValid = await verifyPassword(password, dbPassword, userId);
        if (!isPasswordValid) triggerError("Incorrect login details", [], 401);

        // Check account status
        if (userStatus === 'suspended') triggerError("Your account has been suspended, contact admin", []);

        // Fetch needed data
        return await FetchController.authFetchData(user);
    }

    // REGISTER
    static async register(inputData: RegsiterRevampInterface) {
        const { first_name, email } = inputData;

        // Create user
        const user = await AuthRepository.createUser(inputData);
        if (!user) triggerError("Account creation failed", [], 500);

        // Send welcome email [PASS TO QUEUE JOB]
        sendMessage({ first_name, receiving_medium: email, send_medium: 'email', message_type: 'welcome' }, 'queue');
        
        // Fetch user-related data
        return await FetchController.authFetchData(user);
    }

    // [SEND OTP]
    static async sendOtp(inputData: SendOtpRevampInterface, use_case: otpUseCase) {
        const { receiving_medium } = inputData;
        const send_medium: messageMediumType = (validateInput(receiving_medium, 'email')) ? 'email' : 'whatsapp';

        const data = { receiving_medium, send_medium, use_case};

        const sent = await sendOtp(data);
        if(!sent) triggerError("Request for otp failed", [], 500)

        return [];
    }

    // [VERIFY OTP]
    static async verifyOtp(inputData: VerifyOtpRevampInterface, use_case: otpUseCase) {
        const data = {
            receiving_medium: inputData.receiving_medium,
            code: inputData.code,
            use_case
        };

        const verify = await verifyNewOtp(data);

        return [];
    }

    static async signup(inputData: SignupRevampInterface) {
        const { receiving_medium, code, first_name, email } = inputData;
    
        await verifyUsedOtp({ receiving_medium, use_case: 'sign_up', code });

        // Create user
        const user = await AuthRepository.createUser(inputData);
        if (!user) triggerError("Account creation failed", [], 500);

        // Send welcome email [queue]
        sendMessage({ first_name, receiving_medium: email, send_medium: 'email', message_type: 'welcome' }, 'queue');
        // Clean up OTP [queue]
        queueDeleteOtp(receiving_medium);
        
        // Fetch user-related data
        return await FetchController.authFetchData(user);
    }

    //FORGOT PASSWORD [RESET PASSWORD]
    static async resetPassword(inputData: ResetPasswordRevampInterface) {
        const { code, receiving_medium } = inputData;
        
        await verifyUsedOtp({ receiving_medium, use_case: 'forgot_password', code }); 

        const userData = await AuthRepository.updatePassword(inputData);
        if(!userData) triggerError("Password reset failed", [], 500);

        
        // Send password reset notification email [queue]
        sendMessage(
            { 
                first_name: userData.first_name,
                receiving_medium: userData.email,
                send_medium: 'email', 
                message_type: 'reset_password' 
            }
            , 'queue'
        );
        // Clean up OTP [quue]
        await queueDeleteOtp(receiving_medium);
        
        return;
    }
    

    static async logout(token: string) {
        const response = await deleteApiToken(token);
        if(!response) triggerError("Request failed, try again", [], 500)

        return response;
    }

}

export default AuthService;