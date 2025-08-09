import express, { Request, Response, Router } from 'express';
import AuthController from '#controller/v1/AuthController.cla.js';

const router: Router = express.Router();

//LOGIN
router.post('/login', async (req: Request, res: Response) => {
    AuthController.login(req, res);
});

//REGISTER
router.post('/register', async (req: Request, res: Response) => {
    AuthController.register(req, res);
});

//SEND OTP
router.post('/send_otp/:type', async (req: Request, res: Response) => {
    AuthController.sendOtp(req, res);
});

//VERIFY OTP
router.post('/verify_otp/:type', async (req: Request, res: Response) => {
    AuthController.verifyOtp(req, res);
});


//SIGN UP
router.post('/signup', async (req: Request, res: Response) => {
    AuthController.signup(req, res);
});

//RESET PASSWORD
router.post('/reset_password', async (req: Request, res: Response) => {
    AuthController.resetPassword(req, res);
});

//LOGOUT
router.post('/logout/', async (req: Request, res: Response) => {
    AuthController.logout(req, res);
});


export default router;