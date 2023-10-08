import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Hash class for password hashing and decryption
 * @class
 */
export default class Hash {
    /**
     * Creates a new instance of Hash
     * @constructor
     * @param {Object} secretOptions - The secret options for hashing and encryption
     * @param {string} secretOptions.hashSecret - The secret for hashing
     * @param {string} secretOptions.encryptSecret - The secret for encryption
     * @param {Object} [options] - The options for hashing and encryption
     * @param {number} [options.saltRounds=12] - The number of salt rounds for hashing
     * @param {number} [options.keySize=32] - The size of the key for encryption
     * @param {number} [options.ivSize=16] - The size of the initialization vector for encryption
     */
    constructor(secretOptions, options) {
        this.hashSecret = secretOptions.hashSecret;
        this.encryptSecret = secretOptions.encryptSecret;
        this.options = options || {
            saltRounds: 12,
            keySize: 32,
            ivSize: 16,
        };
    }

    /**
     * Hashes a password
     * @async
     * @param {string} password - The password to hash
     * @returns {Promise<string>} - The hashed password
     * @throws {Error} - If there is an error during hashing or encryption
     */
    async hashPassword(password) {
        try {
            const hashed = await bcrypt.hash(password, this.hashSecret, this.options.saltRounds);
            const encryptedHash = await this.encryptWithAES(hashed);
            const finalHash = await bcrypt.hash(encryptedHash, this.hashSecret, this.options.saltRounds);
            return finalHash;
        } catch (error) {
            throw new Error(`Error hashing password: ${error.message}`);
        }
    }

    /**
     * Decrypts a password hash
     * @async
     * @param {string} hash - The password hash to decrypt
     * @returns {Promise<string>} - The decrypted password
     * @throws {Error} - If there is an error during decryption or hashing
     */
    async decryptPassword(hash) {
        try {
            const decryptedHash = await bcrypt.compare(hash, this.hashSecret);
            const encryptedHash = await bcrypt.compare(decryptedHash, this.encryptSecret);
            const decrypted = await this.decryptWithAES(encryptedHash);
            return decrypted;
        } catch (error) {
            throw new Error(`Error decrypting password: ${error.message}`);
        }
    }

    /**
     * Encrypts data with AES encryption
     * @async
     * @param {string} data - The data to encrypt
     * @returns {Promise<string>} - The encrypted data
     * @throws {Error} - If there is an error during encryption
     */
    async encryptWithAES(data) {
        try {
            const key = crypto.randomBytes(this.options.keySize);
            const iv = crypto.randomBytes(this.options.ivSize);
            const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag();
            const encryptedData = {
                key: key.toString('hex'),
                iv: iv.toString('hex'),
                encrypted: encrypted,
                authTag: authTag.toString('hex'),
            };
            return JSON.stringify(encryptedData);
        } catch (error) {
            throw new Error(`Error encrypting data: ${error.message}`);
        }
    }

    /**
     * Decrypts data with AES encryption
     * @async
     * @param {string} encryptedData - The encrypted data to decrypt
     * @returns {Promise<string>} - The decrypted data
     * @throws {Error} - If there is an error during decryption
     */
    async decryptWithAES(encryptedData) {
        try {
            const { key, iv, encrypted, authTag } = JSON.parse(encryptedData);
            const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
            decipher.setAuthTag(Buffer.from(authTag, 'hex'));
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            throw new Error(`Error decrypting data: ${error.message}`);
        }
    }
}