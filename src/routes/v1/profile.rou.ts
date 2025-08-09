import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

//change username
router.post('/change_username', async (req: Request, res: Response) => {
    
})

//change email
router.post('/change_email', async (req: Request, res: Response) => {
    
})


//send otp
router.get('/send_otp', async (req: Request, res: Response) => {
    
})


//verify otp
router.post('/verify_otp', async (req: Request, res: Response)  => {
    
})



export default router;