import crypto from 'crypto';
import cryptoJS from 'crypto-js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { queueRehash } from '#queue/rehashQueue.js';
import { getEnvorThrow } from '#src/utils/mains/general.util.js';

const ENC_KEY = getEnvorThrow("ENC_KEY");
const ENC_IV = getEnvorThrow("ENC_IV");
const HASH_COST = getEnvorThrow("HASH_COST");
// const ENC_METHOD = getEnvorThrow("ENC_METHOD"); // Encryption method

const enc_array = ['general', 'token', 'receiving_medium'];

// Hash password asynchronously
const hashPassword = async (password: string) => await bcrypt.hash(password, HASH_COST);

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
    return currentRounds !== parseInt(HASH_COST);
}

// Encrypt only if type exists in enc_array
const selEncrypt = (data: string, type: string = 'general') => enc_array.includes(type) ? encrypt(data) : data;

// Decrypt only if type exists in enc_array
const selDecrypt = (data :string , type: string = 'general') => enc_array.includes(type) ? decrypt(data) : data;

const encrypt = (data: string) => cryptoJS.AES.encrypt(
    data,
    cryptoJS.enc.Utf8.parse(ENC_KEY),
    { iv: cryptoJS.enc.Utf8.parse(ENC_IV) }
).toString();

const decrypt = (data: string) => cryptoJS.AES.decrypt(
    data,
    cryptoJS.enc.Utf8.parse(ENC_KEY),
    { iv: cryptoJS.enc.Utf8.parse(ENC_IV) }
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