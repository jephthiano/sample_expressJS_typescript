import mongoose, { Query, UpdateQuery } from 'mongoose';
import type { OtpAttrs } from '#src/types/otp/interface.js';
import { selEncrypt, hashPassword } from '#main_util/security.util.js';
const { Schema } = mongoose;


// Define Schema
const OtpTokenSchema = new Schema({
    receiving_medium: { 
        type: String,
        unique: true,
        required: [true, 'receiving medium is not specified'],
        trim: true 
    },
    code: { 
        type: String,
        unique: true,
        required: [true, 'code is not specified'],
        trim: true 
    },
    use_case: { 
        type: String,
        enum: ['sign_up', 'forgot_password'],
        required: [true, 'use case is not specified'],
    },
    status: { 
        type: String,
        enum: ['new', 'used'],
        default: 'new'
    },
    reg_date: { 
        type: Date, 
        default: Date.now
    }
});

// Shared transformation logic
async function transformOtpUpdate(update:UpdateQuery<OtpAttrs>) {
    const target = update.$set || update;

    // Only hash if it's a plain string (avoid re-hashing)
    if (target.code && !target.code.startsWith('$2b$')) {
        target.code = await hashPassword(target.code);
    }

    if (target.receiving_medium && !target.receiving_medium.startsWith('enc:')) {
        target.receiving_medium = selEncrypt(target.receiving_medium, 'receiving_medium');
    }

    target.reg_date = new Date();

    if (update.$set) {
        update.$set = target;
    } else {
        Object.assign(update, target);
    }

    return update;
}

// Pre-save for new entries
OtpTokenSchema.pre('save', async function (next) {
    if (this.isModified('code') && !this.code.startsWith('$2b$')) {
        this.code = await hashPassword(this.code);
    }

    if (this.isModified('receiving_medium') && !this.receiving_medium.startsWith('enc:')) {
        this.receiving_medium = selEncrypt(this.receiving_medium, 'receiving_medium');
    }

    next();
});

// For all update operations
// as const shows they are fixed string literals [Prevents hook names from becoming string[], so that typescript knows the exact hook name not just some stirng and catches the type]
const updateHooks = ['findOneAndUpdate', 'updateOne', 'updateMany', 'findByIdAndUpdate'] as const; 
updateHooks.forEach(hook => {
  OtpTokenSchema.pre(
    hook as Parameters<typeof OtpTokenSchema.pre>[0],
    async function (this: Query<any, OtpAttrs>, next) {
      const update = this.getUpdate() as UpdateQuery<OtpAttrs>; // this.getUpdate() returns the raw MongoDB update object (e.g., { $set: { code: "1234" } })
      await transformOtpUpdate(update); // run the transform settings
      this.setUpdate(update); // replace the old value with new one
      next();
    }
  );
});


const OtpToken = mongoose.model('OtpTokens', OtpTokenSchema);

export default OtpToken;

