import express, { Request, Response, Router } from 'express';
import { sendMessage } from '#main_util/messaging.util.js';
import { hashPassword } from '#main_util/security.util.js';
import type { sendMessageInterface } from '#src/types/messaging/interface.js';

const router: Router = express.Router();

router.get('/messaging', async (req: Request, res: Response) => {
    // for email
    // const messageData: sendMessageInterface = {
    //     first_name: 'Jephthaooh',
    //     receiving_medium: 'jephthahooh@gmail.com',
    //     type: 'welcome',
    //     send_medium: 'email',
    // };

    // for whatsapp
    // const messageData: sendMessageInterface = {
    //     first_name: 'Jephthaooh',
    //     receiving_medium: '07047474438',
    //     type: 'welcome',
    //     send_medium: 'whatsapp',
    // };

    // for sms notification
    // const messageData: sendMessageInterface = {
    //     first_name: 'Jephthaooh',
    //     receiving_medium: '07047474438',
    //     type: 'welcome',
    //     send_medium: 'sms',
    // };

    // for push notification
    const messageData: sendMessageInterface  = {
        first_name: 'Jephthaooh',
        receiving_medium: 'dfgvghvgvgdv',
        type: 'welcome',
        send_medium: 'push_notification',
    };

    sendMessage(messageData, 'queue');
    res.status(200).json({message:'working'});
});

router.get('/hash', async (req: Request, res: Response) => {
    const hash = await hashPassword('newPAss')
});

export default router;