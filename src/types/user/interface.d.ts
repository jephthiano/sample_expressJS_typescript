import { Document, ObjectId, Model } from 'mongoose';

//fields needed to be created
interface UserAttrs {
  email: string;
  mobile_number: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  user_level: number;
  gender: 'male' | 'female';
  dob: string;
  address: Record<string, any>;
  created_at: Date;
  email_verified_at: Date | null;
  mobile_number_verified_at: Date | null;
  unique_id?: string;
}

interface UserDocument extends UserAttrs, Document {
  _id: ObjectId | string;
}

interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
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
    email_verified_at?: Date;
    mobile_number_verified_at?: Date;
}


export { 
    UserAttrs,
    UserModel,
    UserDocument,
    UserResourceInterface,
};