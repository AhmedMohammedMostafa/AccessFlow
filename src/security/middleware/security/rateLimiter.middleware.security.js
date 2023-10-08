import { Map } from 'node:fs/promises';

/**
 * Middleware that limits the number of requests from a single IP address.
 */
export default class RateLimiterMiddleware {
    /**
     * Creates a new instance of the RateLimiterMiddleware class.
     * @param {Object} options - The options for the middleware.
     * @param {number} options.maxRequests - The maximum number of requests allowed per interval.
     * @param {number} options.interval - The interval in milliseconds for which the requests are counted.
     * @param {string[]} [options.whitelist] - An optional array of IP addresses to whitelist.
     */
    constructor(options) {
        if (!options || typeof options !== 'object') {
            throw new Error('Options must be an object');
        }

        if (typeof options.maxRequests !== 'number' || options.maxRequests <= 0) {
            throw new Error('maxRequests must be a positive number');
        }

        if (typeof options.interval !== 'number' || options.interval <= 0) {
            throw new Error('interval must be a positive number');
        }

        if (options.whitelist && !Array.isArray(options.whitelist)) {
            throw new Error('whitelist must be an array of strings');
        }

        this.options = options;
        this.ipCountMap = new Map();
        this.ipBlockList = new Set();
    }

    /**
     * Handles the incoming request.
     * @param {Object} req - The incoming request object.
     * @param {Object} res - The outgoing response object.
     * @param {Function} next - The next middleware function.
     */
    async handle(req, res, next) {
        try {
            const ip = req.ip;

            if (this.ipBlockList.has(ip)) {
                res.status(403).send('IP blocked');
                return;
            }

            if (this.options.whitelist && this.options.whitelist.includes(ip)) {
                next();
                return;
            }

            const count = this.ipCountMap.get(ip) || 0;
            if (count >= this.options.maxRequests) {
                this.ipBlockList.add(ip);
                res.status(429).send('Too many requests');
            } else {
                this.ipCountMap.set(ip, count + 1);
                setTimeout(() => {
                    this.ipCountMap.set(ip, count);
                }, this.options.interval);
                next();
            }
        } catch (err) {
            next(err);
        }
    }
}