import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { sendMessageDTO } from '#dto/messaging.dto.js';
import type { sendMessageInterface } from '#src/types/messaging/interface.js';
import { getEnvorThrow } from '#src/utils/mains/general.util.js';

class EmailService {
    static host = getEnvorThrow('SMTP_HOST');
    static port = getEnvorThrow('SMTP_PORT');
    static user = getEnvorThrow('SMTP_USER');
    static pass = getEnvorThrow('SMTP_PASS');

  static transporter: Transporter = nodemailer.createTransport({
    host: EmailService.host,
    port: Number(EmailService.port),
    secure: true,
    auth: {
      user: EmailService.user,
      pass: EmailService.pass,
    },
  });

  static async send(data: sendMessageInterface) {
    const dtoData = sendMessageDTO(data);

    if('subject' in dtoData){
        const mailOptions: SendMailOptions = {
          from: EmailService.user,
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
