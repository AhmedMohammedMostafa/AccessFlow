import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Class representing a JSON Web Token.
 */
export default class JWT {
    /**
     * Create a JSON Web Token.
     * @param {Object} secretOptions - The options for the secret.
     * @param {string} secretOptions.secret - The secret to use for the token.
     * @param {Object} [options] - The options for the token.
     * @param {string} [options.algorithm='HS256'] - The algorithm to use for the token.
     * @param {string|number} [options.expiresIn='1h'] - The expiration time for the token.
     */
    constructor(secretOptions, options) {
        this.secret = secretOptions.secret;
        this.options = options || {
            algorithm: 'HS256',
            expiresIn: '1h',
        };
    }

    /**
     * Sign a payload and create a token.
     * @param {Object} payload - The payload to sign.
     * @returns {Promise<string>} - The signed token.
     */
    async sign(payload) {
        return new Promise((resolve, reject) => {
            try {
                const encryptedPayload = this.encryptPayload(payload);
                const token = jwt.sign(encryptedPayload, this.secret, this.options);
                resolve(token);
            } catch (error) {
                reject(new Error(`Failed to sign token: ${error.message}`));
            }
        });
    }

    /**
     * Verify a token and return the payload.
     * @param {string} token - The token to verify.
     * @returns {Promise<Object>} - The decrypted payload.
     */
    async verify(token) {
        return new Promise((resolve, reject) => {
            try {
                const decoded = jwt.verify(token, this.secret);
                const decryptedPayload = this.decryptPayload(decoded);
                resolve(decryptedPayload);
            } catch (error) {
                reject(new Error(`Failed to verify token: ${error.message}`));
            }
        });
    }

    /**
     * Encrypt a payload.
     * @param {Object} payload - The payload to encrypt.
     * @returns {string} - The encrypted payload.
     */
    encryptPayload(payload) {
        const algorithm = 'aes-256-cbc';
        const cipher = crypto.createCipher(algorithm, this.secret);
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    /**
     * Decrypt an encrypted payload.
     * @param {string} encryptedPayload - The encrypted payload to decrypt.
     * @returns {Object} - The decrypted payload.
     */
    decryptPayload(encryptedPayload) {
        const algorithm = 'aes-256-cbc';
        const decipher = crypto.createDecipher(algorithm, this.secret);
        let decrypted = decipher.update(encryptedPayload, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }
}