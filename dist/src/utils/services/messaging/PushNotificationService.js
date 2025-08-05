import { sendMessageDTO } from '#dto/messaging.dto.js';
import { log } from '#main_util/logger.util.js';
const logInfo = (type, data) => log(type, data, 'info');
const logError = (type, data) => log(type, data, 'error');
class PushNotificationService {
    static async send(data) {
        data = sendMessageDTO(data);
        try {
            logInfo('PUSH NOTIFICATION SERVICE', data);
            return true;
        }
        catch (err) {
            logError('PUSH NOTIFICATION SERVICE', err);
            return false;
        }
    }
}
export default PushNotificationService;
