import AuthRepository from '#repository/AuthRepository.cla.js';
import FetchController from '#controller/v1/FetchController.cla.js';
import { verifyPassword, validateInput }  from '#main_util/security.util.js';
import { sendOtp, verifyNewOtp, verifyUsedOtp}  from '#main_util/otp.util.js';
import { queueDeleteOtp } from '#queue/deleteOtpQueue.js';
import { sendMessage } from '#main_util/messaging.util.js';
import { deleteApiToken } from '#main_util/token.util.js';
import { triggerError} from '#core_util/handler.util.js';


class AuthService{

    // LOGIN
    static async login(req) {
        const { login_id, password } = req.body;

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
    static async register(req) {
        const { first_name, email } = req.body;

        // Create user
        const user = await AuthRepository.createUser(req.body);
        if (!user) triggerError("Account creation failed", [], 500);

        // Send welcome email [PASS TO QUEUE JOB]
        sendMessage({ first_name, receiving_medium: email, send_medium: 'email', type: 'welcome' }, 'queue');
        
        // Fetch user-related data
        return await FetchController.authFetchData(user);
    }

    // [SEND OTP]
    static async sendOtp(req, type) {
        const { receiving_medium } = req.body;

        const data = {
            receiving_medium,
            send_medium : (validateInput(receiving_medium, 'email')) ? 'email' : 'whatsapp',
            use_case : type,
            first_name : 'user',
            
        };

        const sent = await sendOtp(data);
        if(!sent) triggerError("Request for otp failed", [], 500)

        return [];
    }

    // [VERIFY OTP]
    static async verifyOtp(req, type) {
        const data = {
            receiving_medium: req.body.receiving_medium,
            code: req.body.code,
            use_case: type
        };

        const verify = await verifyNewOtp(data);

        return [];
    }

    static async signup(req) {
        const { receiving_medium, code, first_name, email } = req.body;
    
        const verifyOtp = await verifyUsedOtp({ receiving_medium, use_case: 'sign_up', code });

        // Create user
        const user = await AuthRepository.createUser(req.body);
        if (!user) triggerError("Account creation failed", [], 500);

        // Send welcome email [queue]
        sendMessage({ first_name, receiving_medium: email, send_medium: 'email', type: 'welcome' }, 'queue');
        // Clean up OTP [queue]
        queueDeleteOtp(receiving_medium);
        
        // Fetch user-related data
        return await FetchController.authFetchData(user);
    }

    //FORGOT PASSWORD [RESET PASSWORD]
    static async resetPassword(req) {
        const { code, receiving_medium } = req.body;
        const verifyOtp = await verifyUsedOtp({ receiving_medium, use_case: 'forgot_password', code }); 

        const updateUserData = await AuthRepository.updatePassword(req.body);
        if(!updateUserData) triggerError("Password reset failed", [], 500);

        
        // Send password reset notification email [queue]
        sendMessage(
            { 
                first_name: updateUserData.first_name,
                receiving_medium: updateUserData.email,
                send_medium: 'email', 
                type: 'reset_password' 
            }
            , 'queue'
        );
        // Clean up OTP [quue]
        await queueDeleteOtp(receiving_medium);
        
        return;
    }
    

    static async logout(req) {
        const response = await deleteApiToken(req);
        if(!response) triggerError("Request failed, try again", [], 500)

        return response;
    }

}

export default AuthService;