import { sendResponse, handleException, triggerError, triggerValidationError, } from '#core_util/handler.util.js';

class BaseController {
  static sendResponse           = sendResponse;
  static handleException        = handleException;
  static triggerError           = triggerError;
  static triggerValidationError = triggerValidationError;
}


export default BaseController;
