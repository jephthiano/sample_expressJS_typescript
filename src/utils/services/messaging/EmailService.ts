import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { sendMessageDTO } from '#src/dtos/core/messaging.dto.js';
import type { sendMessageInterface } from '#src/types/messaging/interface.js';
import { getEnvorThrow } from '#src/utils/mains/general.util.js';

class EmailService {
    static SMTP_HOST = getEnvorThrow('SMTP_HOST');
    static SMTP_PORT = getEnvorThrow('SMTP_PORT');
    static SMTP_USER = getEnvorThrow('SMTP_USER');
    static SMTP_PASS = getEnvorThrow('SMTP_PASS');

  static transporter: Transporter = nodemailer.createTransport({
    host: EmailService.SMTP_HOST,
    port: Number(EmailService.SMTP_PORT),
    secure: true,
    auth: {
      user: EmailService.SMTP_USER,
      pass: EmailService.SMTP_PASS,
    },
  });

  static async send(data: sendMessageInterface) {
    const dtoData = sendMessageDTO(data);

    if('subject' in dtoData){
        const mailOptions: SendMailOptions = {
          from: EmailService.SMTP_USER,
          to: dtoData.receiving_medium,
          subject: dtoData.subject,
          text: dtoData.text_content,
          html: dtoData.html_content,
        };
        
        await EmailService.transporter.sendMail(mailOptions);
    }

  }
}

export default EmailService;
