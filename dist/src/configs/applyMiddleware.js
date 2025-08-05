import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
const applyMiddleware = (app) => {
    const corsOptions = {
        origin: process.env.CLIENT_URL || '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        methods: ['G ET', 'POST', 'DELETE', 'PUT']
    };
    const message = {
        status: 0,
        message: 'Too many requests from this IP, please try again later.'
    };
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100,
        standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false,
        message
    });
    // Apply middlewares
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(limiter);
    app.use(express.json());
    app.use(helmet());
    app.use(xssClean());
    app.use(mongoSanitize());
};
export default applyMiddleware;
