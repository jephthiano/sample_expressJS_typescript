import { sendMessageDTO } from '#src/dtos/core/messaging.dto.js';
import { log } from '#main_util/logger.util.js';
import type { sendMessageInterface } from '#src/types/messaging/interface.js';

const logInfo = (type: string, data: unknown) => log(type, data, 'info');
const logError = (type: string, data: unknown) => log(type, data, 'error');

class SmsService {

    static async send(data: sendMessageInterface) {
        const dtoData = sendMessageDTO(data);

        try {
            logInfo('SMS SERVICE', dtoData);
            return true;
        } catch (err) {
            logError('SMS SERVICE', err);
            return false;
        }
    }
}

export default SmsService;
