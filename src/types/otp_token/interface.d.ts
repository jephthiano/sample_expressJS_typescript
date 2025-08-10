import { Document, ObjectId, Model } from 'mongoose';

interface TokenAttrs {
  user_id: string;
  token: string;
  expire_at: TokenUseCase;
  created_at: TokenStatus;
}

interface TokenDocument extends TokenAttrs, Document {
  _id: ObjectId | string;
}

interface TokenModel extends Model<TokenDocument> {
  build(attrs: TokenAttrs): TokenDocument;
}

export { 
    TokenAttrs,
};
