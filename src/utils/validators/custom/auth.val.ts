import { findUserByEmailOrPhone , findEmailMobileNumberUsername} from '#database/mongo/user.db.js';
import { isEmptyObject, isEmptyString, replaceValues } from '#main_util/general.util.js';
import { validateInput, validatePassword } from '#main_util/security.util.js';
import { LoginInterface, RegsiterInterface, ResetPasswordInterface, SignupInputInterface } from '#src/types/user/interface.js';
import { otpUseCase } from '#src/types/otp/types.js';
import { SendOtpInputInterface, VerifyOtpInputInterface } from '#src/types/otp/interface.js';

// Utility function for response formatting
const formatResponse = (errors: Record<string, string>) => ({
  status: !isEmptyObject(errors),
  data: errors,
});


// Login function
const login = async (inputs: LoginInterface) => {
    const errors: Record<string, string> = {};
    const { login_id, password } = inputs;

    if (!login_id || isEmptyString(login_id)) {
        errors.login_id = "login ID cannot be empty";
    }

    if (!password || isEmptyString(password)) {
        errors.password = "password cannot be empty";
    }

    return formatResponse(errors);
};

// Registration
const register = async (inputs: RegsiterInterface) => {
    const errors: Record<string, string> = {};
    const {email, mobile_number, first_name, last_name, username, gender, password } = inputs;

    const [email_exists, mobile_exists, username_exists] = await findEmailMobileNumberUsername(email, mobile_number, username)
    
    if (!email || isEmptyString(email)) {
        errors.email = "email is required";
    } else if (!validateInput(email, 'email')) {
        errors.email = "invalid email";
    } else if (email_exists) {
        errors.email = "email already exists";
    }

    if (!mobile_number || isEmptyString(mobile_number)) {
        errors.mobile_number = "mobile number is required";
    } else if (!validateInput(mobile_number, 'mobile_number')) {
        errors.mobile_number = "invalid mobile number";
    } else if (mobile_exists) {
        errors.mobile_number = "mobile number already exists";
    }

    if (!username || isEmptyString(username)) {
        errors.username = "username is required";
    } else if (!validateInput(username, 'username')) {
        errors.username = "username should be between 5 to 10 alphabets";
    } else if (username_exists) {
        errors.username = "username already taken";
    }

    if (!first_name || isEmptyString(first_name)) {
        errors.first_name = "first name is required";
    } else if (!validateInput(first_name, 'name')) {
        errors.first_name = "invalid first name";
    }

    if (!last_name || isEmptyString(last_name)) {
        errors.last_name = "last name is required";
    } else if (!validateInput(last_name, 'name')) {
        errors.last_name = "invalid last name";
    }

    if (!gender || (gender !== 'male' && gender !== 'female')) {
        errors.gender = "invalid gender";
    }

    if (!password || isEmptyString(password)) {
        errors.password = "password is required";
    } else if (!validatePassword(password)) {
        errors.password = "password must be at least 8 characters, include uppercase, lowercase, digit, and special character";
    }

    return formatResponse(errors);
};

// signup or forgot_password otp validation
const sendOtp = async (inputs: SendOtpInputInterface, type: otpUseCase) => {
    const errors: Record<string, string> = {};
    const { receiving_medium } = inputs;
    const mediumType = validateInput(receiving_medium, 'mobile_number') ? 'mobile_number' : 'email';
    const resType = replaceValues(mediumType, '_', ' ')

    if (type === 'sign_up') {
        const data_exists = await findUserByEmailOrPhone(receiving_medium);

        if (!receiving_medium || isEmptyString(receiving_medium)) {
            errors.receiving_medium = "field is required";
        } else if (data_exists) { // if data is in db
            errors.receiving_medium = `${resType} already taken`;
        } else if (!validateInput(receiving_medium, mediumType)) {
            errors.receiving_medium = `invalid ${resType}`;
        }
    } else if (type === 'forgot_password') {
        const data_exists = await findUserByEmailOrPhone(receiving_medium);

        if (!receiving_medium || isEmptyString(receiving_medium)) {
            errors.receiving_medium = `Email/mobile number is required`;
        } else if (!data_exists) { // if the data is not in db
            errors.receiving_medium = `${resType} does not exist`;
        }
    }else{
        errors.receiving_medium = "field is required";
    }

    return formatResponse(errors);
};

// Verify OTP
const verifyOtp = async (inputs: VerifyOtpInputInterface) => {
    const errors: Record<string, string> = {};
    const { code } = inputs;

    if (!code || !validateInput(code, 'otp_code')) {
        errors.code = "invalid OTP code";
    }

    return formatResponse(errors);
};

// signup
const signup = async (inputs: SignupInputInterface) => {
    const errors: Record<string, string> = {};
    const {receiving_medium, email, mobile_number, first_name, last_name, username, gender, password } = inputs;

    const [email_exists, mobile_exists, username_exists] = await findEmailMobileNumberUsername(
        email ?? null,
        mobile_number ?? null,
        username
  );

    //if receiving medium is mobile number else email
    if(validateInput(receiving_medium, 'mobile_number')){
        if (!email || isEmptyString(email)) {
            errors.email = "email is required";
        } else if (!validateInput(email, 'email')) {
            errors.email = "invalid email";
        } else if (email_exists) {
            errors.email = "email already exists";
        }
    } else {
        if (!mobile_number || isEmptyString(mobile_number)) {
            errors.mobile_number = "mobile number is required";
        } else if (!validateInput(mobile_number, 'mobile_number')) {
            errors.mobile_number = "invalid mobile number";
        } else if (mobile_exists) {
            errors.mobile_number = "mobile number already exists";
        }
    }

    if (!username || isEmptyString(username)) {
        errors.username = "username is required";
    } else if (!validateInput(username, 'username')) {
        errors.username = "username should be between 5 to 10 alphabets";
    } else if (username_exists) {
        errors.username = "username already taken";
    }

    if (!first_name || isEmptyString(first_name)) {
        errors.first_name = "first name is required";
    } else if (!validateInput(first_name, 'name')) {
        errors.first_name = "invalid first name";
    }

    if (!last_name || isEmptyString(last_name)) {
        errors.last_name = "last name is required";
    } else if (!validateInput(last_name, 'name')) {
        errors.last_name = "invalid last name";
    }

    if (!gender || (gender !== 'male' && gender !== 'female')) {
        errors.gender = "invalid gender";
    }

    if (!password || isEmptyString(password)) {
        errors.password = "password is required";
    } else if (!validatePassword(password)) {
        errors.password = "password must be at least 8 characters, include uppercase, lowercase, digit, and special character";
    }

    return formatResponse(errors);
};

// Reset Password
const resetPassword = (inputs: ResetPasswordInterface) => {
    const errors: Record<string, string> = {};
    const { password, confirm_password } = inputs;

    if (!validatePassword(password)) {
        errors.password = "Password must be at least 8 characters, include uppercase, lowercase, digit, and special character";
    } else if (password !== confirm_password) {
        errors.password = "Passwords do not match";
    }

    return formatResponse(errors);
};

export {  login, 
            register, 
            sendOtp, 
            verifyOtp, 
            signup,
            resetPassword
        };
