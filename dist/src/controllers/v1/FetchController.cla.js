import BaseController from '#controller/BaseController.cla.js';
import FetchService from '#service/v1/FetchService.cla.js';
class FetchController extends BaseController {
    static async authFetchData(id) {
        return await FetchService.authFetchData(id);
    }
    static async appFetchData(req, res) {
        try {
            const response = await FetchService.appFetchData(req);
            return this.sendResponse(res, response, "Success");
        }
        catch (error) {
            this.handleException(res, error);
        }
    }
}
export default FetchController;
