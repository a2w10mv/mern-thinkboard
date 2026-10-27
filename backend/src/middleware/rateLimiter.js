const ratelimiter = async (req, res, next) => {
    // Disable rate limiting for local tests without Upstash keys
    if (!process.env.UPSTASH_REDIS_REST_URL) {
        return next();
    }
    try {
        const ratelimit = (await import('../configs/upstash.js')).default;
        const {success} = await ratelimit.limit("my-limit-key")
        if(!success) {
            return res.status(429).json({
                message:"too many requests, please try again later"
            })
        }
        next()
    } catch (error) {
        console.error("Rate limiter error:", error);
        next(error)
    }
}

export default ratelimiter;
