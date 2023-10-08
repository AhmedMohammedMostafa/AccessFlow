import forge from 'node-forge';

/**
 * Class representing a Crypto object for encryption and decryption.
 */
export default class Crypto {
    /**
     * Create a Crypto object.
     * @param {Object} secretOptions - The secret options for encryption.
     * @param {string} secretOptions.encryptSecret - The encryption secret.
     * @param {Object} [options] - The options for encryption.
     * @param {number} [options.keySize=4096] - The key size for encryption.
     */
    constructor(secretOptions, options) {
        this.encryptSecret = secretOptions.encryptSecret;
        this.options = options || { keySize: 4096 };
    }

    /**
     * Encrypts a string.
     * @param {string} string - The string to be encrypted.
     * @returns {Promise<string>} - The encrypted string.
     * @throws {Error} - Throws an error if encryption fails.
     */
    async encrypt(string) {
        return new Promise((resolve, reject) => {
            try {
                const publicKey = forge.pki.publicKeyFromPem(this.encryptSecret);
                const encrypted = publicKey.encrypt(string, 'RSA-OAEP');
                resolve(encrypted);
            } catch (error) {
                reject(new Error(`Encryption failed: ${error.message}`));
            }
        });
    }

    /**
     * Decrypts a string.
     * @param {string} string - The string to be decrypted.
     * @returns {Promise<string>} - The decrypted string.
     * @throws {Error} - Throws an error if decryption fails.
     */
    async decrypt(string) {
        return new Promise((resolve, reject) => {
            try {
                const privateKey = forge.pki.privateKeyFromPem(this.encryptSecret);
                const decrypted = privateKey.decrypt(string, 'RSA-OAEP');
                resolve(decrypted);
            } catch (error) {
                reject(new Error(`Decryption failed: ${error.message}`));
            }
        });
    }
}