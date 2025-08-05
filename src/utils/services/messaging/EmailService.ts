import nodemailer from 'nodemailer';
import { sendMessageDTO } from '#dto/messaging.dto.js';

class EmailService {
    static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    static async send(data) {
        data = sendMessageDTO(data);

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: data.receiving_medium,
            subject: data.subject,
            text: data.text_content,
            html: data.html_content,
        };

        await EmailService.transporter.sendMail(mailOptions);
    }
}

export default EmailService;
