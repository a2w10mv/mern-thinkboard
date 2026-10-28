import { jest } from '@jest/globals';

describe('rateLimiter middleware', () => {
    let req, res, next;
    let mockLimit;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        mockLimit = jest.fn();

        // Reset environment variable for each test
        delete process.env.UPSTASH_REDIS_REST_URL;

        jest.unstable_mockModule('../configs/upstash.js', () => ({
            default: {
                limit: mockLimit
            }
        }));

        // Mock console.error to avoid noise in the test output
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        console.error.mockRestore();
    });

    it('should call next() immediately if UPSTASH_REDIS_REST_URL is not set', async () => {
        const { default: ratelimiter } = await import('./rateLimiter.js');
        await ratelimiter(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(mockLimit).not.toHaveBeenCalled();
    });

    it('should call next() if rate limit allows the request (success: true)', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'http://test-redis-url';
        mockLimit.mockResolvedValue({ success: true });

        const { default: ratelimiter } = await import('./rateLimiter.js');
        await ratelimiter(req, res, next);

        expect(mockLimit).toHaveBeenCalledTimes(1);
        expect(mockLimit).toHaveBeenCalledWith('rate-limit:unknown');
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 429 status if rate limit blocks the request (success: false)', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'http://test-redis-url';
        mockLimit.mockResolvedValue({ success: false });

        const { default: ratelimiter } = await import('./rateLimiter.js');
        await ratelimiter(req, res, next);

        expect(mockLimit).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
            message: "too many requests, please try again later"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(error) if Upstash throws an error', async () => {
        process.env.UPSTASH_REDIS_REST_URL = 'http://test-redis-url';
        const error = new Error('Upstash error');
        mockLimit.mockRejectedValue(error);

        const { default: ratelimiter } = await import('./rateLimiter.js');
        await ratelimiter(req, res, next);

        expect(mockLimit).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Rate limiter error:", error);
    });
});
