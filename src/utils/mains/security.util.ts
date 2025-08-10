import crypto from 'crypto';
import cryptoJS from 'crypto-js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { queueRehash } from '#queue/rehashQueue.js';
import { getEnvorThrow } from './general.util.js';

const key = getEnvorThrow("ENC_KEY");
const iv = getEnvorThrow("ENC_IV");
const cost = getEnvorThrow("HASH_COST");
// const method = getEnvorThrow("ENC_METHOD"); // Encryption method

const enc_array = ['general', 'token', 'receiving_medium'];

// Hash password asynchronously
const hashPassword = async (password: string) => await bcrypt.hash(password, 10);

// Verify password asynchronously
const verifyPassword = async (plainPassword: string, hashedPassword: string, userId: null | string = null) => {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (!match) return false;

    // pass to queue job [if rehash is needed]
    if (passwordNeedRehash(hashedPassword) && userId) queueRehash({userId, plainPassword });

    return true;
};


const passwordNeedRehash = (hashedPassword: string): boolean => {
    const currentRounds: number = parseInt(hashedPassword.split('$')[2], 10); // split by $
    return currentRounds !== parseInt(cost);
}

// Encrypt only if type exists in enc_array
const selEncrypt = (data: string, type: string = 'general') => enc_array.includes(type) ? encrypt(data) : data;

// Decrypt only if type exists in enc_array
const selDecrypt = (data :string , type: string = 'general') => enc_array.includes(type) ? decrypt(data) : data;

const encrypt = (data: string) => cryptoJS.AES.encrypt(
    data,
    cryptoJS.enc.Utf8.parse(key),
    { iv: cryptoJS.enc.Utf8.parse(iv) }
).toString();

const decrypt = (data: string) => cryptoJS.AES.decrypt(
    data,
    cryptoJS.enc.Utf8.parse(key),
    { iv: cryptoJS.enc.Utf8.parse(iv) }
).toString(cryptoJS.enc.Utf8);

const validateInput = (data: string, type: string) => {
    switch (type) {
        case 'email': return validator.isEmail(data);
        case 'name': return validator.isAlpha(data) && validator.isLength(data, { min: 1, max: 50 });
        case 'username': return validator.isAlphanumeric(data) && validator.isLength(data, { min: 5, max: 10 });
        case 'otp_code': return validator.isNumeric(data) && validator.isLength(data, { min: 6, max: 6 });
        case 'mobile_number': return validator.isNumeric(data) && validator.isLength(data, { min: 11, max: 11 });
        default: return false;
    }
};

const validatePin = (pin: string) => validator.isNumeric(pin) && validator.isLength(pin, { min: 4, max: 4 }) && pin !== '1234';

const validatePassword = (password: string) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+_!@#$^&*.,?]).{8,}$/.test(password);

const generateUniqueToken = () => crypto.randomBytes(32).toString('hex');

const generateUniqueId = (max: number) => crypto.randomInt(2, Number(`1${'0'.repeat(max)}`));

export {
    hashPassword,
    verifyPassword,
    selEncrypt,
    selDecrypt,
    validateInput,
    validatePin,
    validatePassword,
    generateUniqueToken,
    generateUniqueId
};

// static encrypt1(text){
    //     const cipher = crypto.createCipheriv(method, Buffer.from(key), iv);
    //     let encrypted = cipher.update(text);
    //     encrypted = Buffer.concat([encrypted, cipher.final()]);
    //     return encrypted.toString('hex');
    // }

    // static decrypt1(text){
    //     const encryptedText = Buffer.from(text, 'hex');
    //     const decipher = crypto.createDecipheriv(method, Buffer.from(key), iv);
    //     let decrypted = decipher.update(encryptedText);
    //     decrypted = Buffer.concat([decrypted, decipher.final()]);
    //     return decrypted.toString();
    // }