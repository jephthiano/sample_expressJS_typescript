import type { LoginInputInterface, RegsiterInputInterface, ResetPasswordInputInterface, SignupInputInterface, SendOtpInputInterface, VerifyOtpInputInterface, 
                SignupRevampInterface, ResetPasswordRevampInterface, LoginRevampInterface, RegsiterRevampInterface,
                SendOtpRevampInterface,
                VerifyOtpRevampInterface,
            } from '#src/types/auth/interface.js';
import { validateInput } from '#src/utils/mains/security.util.js';

const  loginInputDto = (data: LoginInputInterface): LoginRevampInterface => {
    return {
        login_id: data.login_id.trim().toLowerCase(),
        password: data.password,
    };
}


const registerInputDto = (data: RegsiterInputInterface): RegsiterRevampInterface => {
    return {
        email: data.email.trim().toLowerCase(),
        mobile_number: data.mobile_number,
        username: data.username.trim(),
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender.trim().toLowerCase(),
        password: data.password,
        email_verified_at: null,
        mobile_number_verified_at: null,
    }
}

const sendOtpInputDto = (data: SendOtpInputInterface): SendOtpRevampInterface => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
    }
}

const verifyOtpInputDto = (data: VerifyOtpInputInterface): VerifyOtpRevampInterface => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
    }
}


const signupInputDto = (data: SignupInputInterface): SignupRevampInterface  => {
    const veriType = validateInput(data.receiving_medium, 'mobile_number') ? 'mobile_number' : 'email'
                
    const email = (veriType === 'email')  ? data.receiving_medium.trim().toLowerCase() : data.email?.trim().toLowerCase() ?? "";
    const mobile_number = (veriType === 'mobile_number') ? data.receiving_medium?.trim() : data.mobile_number?.trim() ?? "";
    const email_verified_at = (veriType === 'email') ? new Date() : undefined ;
    const mobile_number_verified_at = (veriType === 'mobile_number') ? new Date() : undefined ;

    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
        email,
        mobile_number,
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        password: data.password,
        email_verified_at,
        mobile_number_verified_at,
    }
}

const resetPasswordInputDto = (data: ResetPasswordInputInterface): ResetPasswordRevampInterface => {
    return {
        receiving_medium: data.receiving_medium.trim().toLowerCase(),
        code: data.code,
        password: data.password,
    }
}


export { 
    loginInputDto,
    registerInputDto,
    sendOtpInputDto,
    verifyOtpInputDto,
    signupInputDto,
    resetPasswordInputDto
 };