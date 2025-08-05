import BaseController from '#controller/BaseController.cla.js';
import AuthService from '#service/v1/AuthService.cla.js';
import { register, sendOtp, verifyOtp, signup, resetPassword} from '#validator_util/custom/auth.val.js';
import { loginJoi } from '#validator_util/joi/auth.joi.js';
import { parseMessageToObject } from '#main_util/general.util.js';


class AuthController extends BaseController{

    // LOGIN
    static async login(req, res) {
        try {

            // Validate inputs using Joi DTO
            const { error, value } = loginJoi.validate(req.body, { abortEarly: false });
            if (error) this.triggerValidationError(parseMessageToObject(error));
            
            const response = await AuthService.login(req);
            this.sendResponse(res, response, "Login successful");
        } catch (error) {
            this.handleException(res, error);
        }

    }

    // REGISTER
    static async register(req, res) {
        try {
            //validate inputs
            const { status, data } = await register(req.body, 'single');
            if (status) this.triggerValidationError(data);

            const response = await AuthService.register(req);

            this.sendResponse(res, response, "Account successfully created");
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // SEND OTP
    static async sendOtp(req, res) {
        const { type } = req.params;

        try {
            if(type !== 'sign_up' && type !== 'forgot_password') this.triggerError("Invalid Request", []);

            //validate inputs
            const { status, data } = await sendOtp(req.body, type);
            if (status) this.triggerValidationError(data);

            const response = await AuthService.sendOtp(req, type);

            this.sendResponse(res, response, "Otp code successful sent");
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // VERIFY OTP
    static async verifyOtp(req, res) {
        const { type } = req.params;

        try {
            if (type !== 'sign_up' && type !== 'forgot_password') this.triggerError("Invalid Request", []);

            // validate inputs
            const { status, data } = await verifyOtp(req.body, type);
            if (status) this.triggerValidationError(data);
            
            const response =  await AuthService.verifyOtp(req, type);

            return this.sendResponse(res, response, "Otp code successful verified");
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // SIGNUP
    static async signup(req, res) {
        try {
            //validate inputs
            const { status, data } = await signup(req.body, 'multi');
            if (status) this.triggerValidationError(data);

            const response =  await AuthService.signup(req);

            this.sendResponse(res, response, "Account successfully created");
        } catch (error) {
            this.handleException(res, error);
        }
    }

    // RESET PASSWORD
    static async resetPassword(req, res) {
        try {
            //validate inputs
            const { status, data } = await resetPassword(req.body);
            if (status) this.triggerValidationError(data);

           const response =  await AuthService.resetPassword(req);
           
           this.sendResponse(res, response, "Password successfully reset");
        } catch (error) {
            this.handleException(res, error);
        }
    }


    // LOGOUT
    static async logout(req, res) {
         try {
            const response =  await AuthService.logout(req);

            this.sendResponse(res, response, "Logout successfully");
        } catch (error) {
            this.handleException(res, error);
        }
    }
    
}

export default AuthController;