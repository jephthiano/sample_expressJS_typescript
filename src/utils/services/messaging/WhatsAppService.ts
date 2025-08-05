import { sendMessageDTO } from '#dto/messaging.dto.js';
import { log } from '#main_util/logger.util.js';

const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');

class WhatsAppService {

    static async send(data) {
        data = sendMessageDTO(data);

        try {
            logInfo('WHATSAPP SERVICE', data);
            return true;
        } catch (err) {
            //fix()
            logError('WHATSAPP SERVICE', err);
            return false;
        }
    }
}

export default WhatsAppService;
