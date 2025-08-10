import { Document } from 'mongoose';

interface LoginInterface {
  login_id: string;
  password: string;
};

interface RegsiterInterface {// remove and replace with createUserInterface is one regsiter system is used
  email: string;
  mobile_number: string;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  password: string;
}

interface SignupInputInterface { // remove and replace with createUserInterface is one regsiter system is used
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

interface CreateUserInterface extends SignupInputInterface{ // used by register and sign up
    receiving_medium?: string;
    code?: string;
    email?: string;
    mobile_number?: string;
    username: string;
    first_name: string;
    last_name: string;
    gender: string;
    password: string;
};

interface ResetPasswordInterface {
    receiving_medium: string;
    code: string;
    password: string;
    confirm_password: string;
}

interface UserDocumentInterface extends Document {
    unique_id: string;
    email: string;
    mobile_number: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    role: string;
    status: string;
    user_level: number;
    gender: string;
    dob: string;
    address: {};
    created_at: Date;
    email_verified_at: Date;
    mobile_number_verified_at: Date;
}

interface UserModelInterface extends UserDocumentInterface {
    _id: string;
}

interface UserResourceInterface {
    id: string;
    unique_id: string;
    email: string;
    mobile_number: string;
    username: string;
    first_name: string;
    last_name: string;
    role: string;
    status: string;
    user_level: number;
    gender: string;
    dob: string;
    address: {};
    created_at: Date;
    email_verified_at: Date;
    mobile_number_verified_at: Date;
}


export { 
    LoginInterface,
    RegsiterInterface,
    SignupInputInterface,
    CreateUserInterface, 
    ResetPasswordInterface,
    UserDocumentInterface,
    UserModelInterface,
    UserResourceInterface,
};