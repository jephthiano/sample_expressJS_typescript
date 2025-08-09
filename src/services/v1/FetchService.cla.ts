import { Request } from 'express';
import FetchRepository from '#repository/FetchRepository.cla.js';
import { setApiToken, getApiToken } from '#main_util/token.util.js';
import UserResource from '#resource/UserResource.js';
import { triggerError} from '#core_util/handler.util.js';
import { UserModelInterface } from '#src/types/user/interface.js';


class FetchService{
    static async authFetchData (user ){
        //get user data
        const token = user ? await setApiToken(user.id) : null ;

        if(token && user){
            const data = new UserResource(user).toJSON();
            return {token, data};
        }

        return {};
    }

    static async appFetchData (req: Request){
        //get user data
        const user?: UserModelInterface = await FetchRepository.getUserById(req.user.id);
        const token = getApiToken(req); // change to get token

        if(token && user){
            const data = new UserResource(user).toJSON();
            const response = {token, data}
            return response;
        }

        triggerError("User not found", [], 404);
    }
}

export default FetchService;