import { Request } from 'express';
import FetchRepository from '#repository/FetchRepository.cla.js';
import { setApiToken, getApiToken } from '#main_util/token.util.js';
import UserResource from '#resource/UserResource.js';
import { triggerError} from '#core_util/handler.util.js';
import type { UserDocument } from '#src/types/user/interface.js';


class FetchService{
    static async authFetchData (userData: UserDocument | null){
        const token = userData ? await setApiToken(userData.id) : null ;

        if(token && userData){
            const data = new UserResource(userData).toJSON();
            return {token, data};
        }

        return {};
    }

    static async appFetchData (userId: string, token: string){
        //get user data
        const user: UserDocument | null = await FetchRepository.getUserById(userId);

        if(token && user){
            const data = new UserResource(user).toJSON();
            const response = {token, data}
            return response;
        }

        triggerError("User not found", [], 404);
    }
}

export default FetchService;