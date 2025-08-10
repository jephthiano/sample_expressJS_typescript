import { Request, Response } from 'express';
import BaseController from '#controller/BaseController.cla.js';
import FetchService from '#service/v1/FetchService.cla.js';
import { UserDocument } from '#src/types/user/interface.js';


class FetchController extends BaseController{
    static async authFetchData (user: UserDocument | null){
        return await FetchService.authFetchData(user);
    }

    static async appFetchData (req: Request, res: Response){
        try{
            const response = await FetchService.appFetchData(req);

            return this.sendResponse(res, response, "Success");
        }catch(error){
            this.handleException(res, error);
        }
    }
    
}

export default FetchController