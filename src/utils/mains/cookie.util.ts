import { UserResourceInterface } from "#src/types/user/interface.js";
import { Request, Response } from "express";
import { getEnvorThrow } from "./general.util.js";

const setTokenCookie = (res: Response, token: string|null) => {
    const tokenType = getEnvorThrow('TOKEN_TYPE');

    if(token && tokenType === 'cookie'){
        res.cookie("_menatreyd", token, {
            httpOnly: true,
            // secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
    }
}

const extractCookieToken = (req: Request) => {
    return req.cookies._menatreyd;
}

export {
    setTokenCookie,
    extractCookieToken,
}