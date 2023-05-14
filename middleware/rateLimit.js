import rateLimit from "express-rate-limit";

export const rateLimiterPerIp = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 5, // Limit each IP to 5 requests per 3 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Osiągnięto maksymalną liczbę zapytań, poczekaj 3 minuty",
});
