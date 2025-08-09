import { Document } from 'mongoose';


interface TokenDocument extends Document {
    user_id: string;
    token: string;
    expire_at: Date;
    created_at: Date;
}


export { 
    TokenDocument,
};
