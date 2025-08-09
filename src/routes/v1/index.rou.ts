import express, { Request, Response, Router } from 'express';
import auth from '#route/v1/auth.rou.js';
import fetch from '#route/v1/fetch.rou.js';
import test from '#route/v1/test.rou.js';
import { tokenValidator } from '#middleware/tokenValidator.js';
import { returnNotFound} from '#core_util/handler.util.js';

const router: Router = express.Router();

// USING ROUTES
router.use("/test", test);// test route
router.use("/auth",auth);// auth route
router.use("/fetch", tokenValidator, fetch);// fetch route
// router.use("/profile", tokenValidator, profile);// profile 

router.use('*', (req: Request, res: Response) => {
    returnNotFound(res, 'Invalid request');
})

export default router;