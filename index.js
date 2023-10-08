import JWT from "./src/jwt/jwt.jwt.js";
import RateLimiterMiddleware from "./src/security/middleware/security/rateLimiter.middleware.security.js";
import Email from "./src/libs/email/nodemailer.js";
import Hash from "./src/security/hash/hash.security.js";
import Crypto from "./src/security/encrypt/encrypt.security.js";

/**
 * AccessFlow class for handling authentication and authorization flows.
 * @class
 */
export default class AccessFlow {
    /**
     * Creates an instance of AccessFlow.
     * @constructor
     * @param {Object} options - The options object.
     * @param {Object} options.jwt - The JWT options object.
     * @param {Object} options.rateLimiter - The rate limiter options object.
     * @param {Object} options.email - The email options object.
     * @param {Object} options.hash - The hash options object.
     * @param {Object} options.encrypt - The encrypt options object.
     * @throws {Error} Throws an error if options object is not provided.
     */
    constructor(options) {
        if (!options) {
            throw new Error("Options object is required.");
        }

        this.options = options;
        this.jwt = new JWT(options.jwt);
        this.rateLimiter = new RateLimiterMiddleware(options.rateLimiter);
        this.email = new Email(options.email);
        this.hash = new Hash(options.hash);
        this.encrypt = new Crypto(options.encrypt);
    }
}

export { JWT, RateLimiterMiddleware, Email, Hash, Crypto };
