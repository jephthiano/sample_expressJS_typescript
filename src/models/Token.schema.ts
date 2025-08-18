import mongoose, { Query, UpdateQuery } from 'mongoose';
import type { TokenAttrs } from '#src/types/token/interface.js';
import { selEncrypt } from '#main_util/security.util.js';
const { Schema } = mongoose;

const TokenSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: true,
    },

    token: {
        type: String,
        unique: true,
        required: true
    },

    expire_at: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        index: { expires: 0 }
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

async function transformTokenUpdate(update: UpdateQuery<TokenAttrs>) {
    const target = update.$set || update;

    if (target.token) {
        target.token = selEncrypt(target.token, 'token');
        target.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    }

    if (update.$set) update.$set = target;
    else Object.assign(update, target);

    return update;
}

TokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        this.token = selEncrypt(this.token, 'token');
        this.expire_at = new Date(Date.now() + 60 * 60 * 1000);
    }
    next();
});

// For all update operations
// as const shows they are fixed string literals [Prevents hook names from becoming string[], so that typescript knows the exact hook name not just some stirng and catches the type]
const updateHooks = ['findOneAndUpdate', 'updateOne', 'updateMany', 'findByIdAndUpdate'] as const; 
updateHooks.forEach(hook => {
  TokenSchema.pre(
    hook as Parameters<typeof TokenSchema.pre>[0],
    async function (this: Query<any, TokenAttrs>, next) {
      const update = this.getUpdate() as UpdateQuery<TokenAttrs>; // this.getUpdate() returns the raw MongoDB update object (e.g., { $set: { code: "1234" } })
      await transformTokenUpdate(update); // run the transform settings
      this.setUpdate(update); // replace the old value with new one
      next();
    }
  );
});

const Token = mongoose.model('tokens', TokenSchema);

export default Token;
