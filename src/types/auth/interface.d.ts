import { Document, ObjectId, Model } from 'mongoose';
import SignupInputInterface from '#src/types/auth/interface.js';


interface LoginInputInterface {
  login_id: string;
  password: string;
};

interface LoginRevampInterface extends LoginInputInterface {}

interface RegsiterInputInterface {
  email: string;
  mobile_number: string;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  password: string;
}

interface RegsiterRevampInterface extends RegsiterInputInterface {
  mobile_number_verified_at: null,
    email_verified_at: null,
}

interface SignupInputInterface { 
    receiving_medium: string;
    code: string;
    email?: string;
    mobile_number?: string;
    username: string;
    first_name: string;
    last_name: string;
    gender: string;
    password: string;
}

interface SignupRevampInterface {
    receiving_medium: string;
    code: string;
    email: string;
    mobile_number: string;
    username: string;
    first_name: string;
    last_name: string;
    gender: string;
    password: string;
    mobile_number_verified_at?: Date,
    email_verified_at?: Date,

}

interface ResetPasswordInputInterface {
    receiving_medium: string;
    code: string;
    password: string;
    confirm_password: string;
}

interface ResetPasswordRevampInterface {
    receiving_medium: string;
    code: string;
    password: string;
}

interface SendOtpInputInterface {
  receiving_medium: string;
}

interface SendOtpRevampInterface extends SendOtpInputInterface { }

interface VerifyOtpInputInterface extends SendOtpInputInterface{
  code: string;
}

interface VerifyOtpRevampInterface extends VerifyOtpInputInterface { }


export { 
    LoginInputInterface,
    LoginRevampInterface,
    RegsiterInputInterface,
    RegsiterRevampInterface,
    SignupInputInterface,
    SignupRevampInterface,
    ResetPasswordInputInterface,
    ResetPasswordRevampInterface,
    SendOtpInputInterface,
    SendOtpRevampInterface,
    VerifyOtpInputInterface,
    VerifyOtpRevampInterface,
};