import { sendResponse, handleException, triggerError, triggerValidationError, } from '#core_util/handler.util.js';
class BaseController {
}
BaseController.sendResponse = sendResponse;
BaseController.handleException = handleException;
BaseController.triggerError = triggerError;
BaseController.triggerValidationError = triggerValidationError;
export default BaseController;
