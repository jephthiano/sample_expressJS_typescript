import { Request, Response } from 'express';
import BaseController from '#controller/BaseController.cla.js';
import FetchService from '#service/v1/FetchService.cla.js';
import type { UserDocument } from '#src/types/user/interface.js';
import { getApiToken } from '#src/utils/mains/token.util.js';


class FetchController extends BaseController{
    static async authFetchData (userData: UserDocument | null){
        return await FetchService.authFetchData(userData);
    }

    static async appFetchData (req: Request, res: Response){
        try{
            const userId = req.user.id;
            const token = getApiToken(req);

            if (!userId || !token) this.triggerError("Request failed, try again", [], 400);

            const response = await FetchService.appFetchData(userId, token);

            return this.sendResponse(res, response, "Success");
        }catch(error){
            this.handleException(res, error);
        }
    }
    
}

export default FetchController