
import mongoose, {Model,  Query, UpdateQuery } from 'mongoose';
import type { UserAttrs, UserDocument, UserModel } from '#src/types/user/interface.js';
import { hashPassword, selEncrypt, generateUniqueId } from '#main_util/security.util.js';
const { Schema } = mongoose;

const UserSchema = new Schema({
    unique_id: {
        type: String,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is not specified'],
        trim: true,
    },
    mobile_number: {
        type: String,
        unique: true,
        required: [true, 'mobile number is not specified'],
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'username is not specified'],
        trim: true,
    },
    first_name: {
        type: String,
        required: [true, 'first name is not specified'],
        trim: true,
    },
    last_name: {
        type: String,
        required: [true, 'last name is not specified'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is not specified'],
        trim: true,
    },
    role: { 
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    user_level: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'gender is not specified'],
    },
    dob: String,
    address: Object,
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    email_verified_at: {
        type: Date,
        default: null,
    },
    mobile_number_verified_at: {
        type: Date,
        default: null,
    },
});

// Reusable transformer for update objects
async function transformUserUpdate(update: UpdateQuery<UserAttrs>) {
    const target = update.$set || update;

    if (target.password) target.password = await hashPassword(target.password);
    if (target.token) target.token = await hashPassword(target.token);

    if (target.email) target.email = selEncrypt(target.email.toLowerCase(), 'email');
    if (target.mobile_number) target.mobile_number = selEncrypt(target.mobile_number, 'mobile_number');
    if (target.username) target.username = selEncrypt(target.username.toLowerCase(), 'username');
    if (target.first_name) target.first_name = selEncrypt(target.first_name.toLowerCase(), 'first_name');
    if (target.last_name) target.last_name = selEncrypt(target.last_name.toLowerCase(), 'last_name');

    if (update.$set) update.$set = target;
    else Object.assign(update, target);

    return update;
}


// Pre-save
UserSchema.pre('save', async function (next) {
    this.unique_id = "user" + generateUniqueId(10);

    if (this.isModified('email')) this.email = selEncrypt(this.email.toLowerCase(), 'email');
    if (this.isModified('mobile_number')) this.mobile_number = selEncrypt(this.mobile_number, 'mobile_number');
    if (this.isModified('username')) this.username = selEncrypt(this.username.toLowerCase(), 'username');
    if (this.isModified('first_name')) this.first_name = selEncrypt(this.first_name.toLowerCase(), 'first_name');
    if (this.isModified('last_name')) this.last_name = selEncrypt(this.last_name.toLowerCase(), 'last_name');
    if (this.isModified('password')) this.password = await hashPassword(this.password);

    // if (!this.user_account) {
    //     this.user_account = { balance: "0" };
    // }

    next();
});


// Update hooks
// For all update operations
// as const shows they are fixed string literals [Prevents hook names from becoming string[], so that typescript knows the exact hook name not just some stirng and catches the type]
const updateHooks = ['findOneAndUpdate', 'updateOne', 'updateMany', 'findByIdAndUpdate'] as const; 
updateHooks.forEach(hook => {
  UserSchema.pre(
    hook as Parameters<typeof UserSchema.pre>[0],
    async function (this: Query<any, UserAttrs>, next) {
      const update = this.getUpdate() as UpdateQuery<UserAttrs>; // this.getUpdate() returns the raw MongoDB update object (e.g., { $set: { code: "1234" } })
      await transformUserUpdate(update); // run the transform settings
      this.setUpdate(update); // replace the old value with new one
      next();
    }
  );
});

export const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;
