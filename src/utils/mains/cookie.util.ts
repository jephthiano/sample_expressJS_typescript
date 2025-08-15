import { Request, Response } from "express";
import { getEnvorThrow } from "#src/utils/mains/general.util.js";

const setTokenCookie = (res: Response, token: string|null) => {
    const TOKEN_TYPE = getEnvorThrow('TOKEN_TYPE');

    if(token && TOKEN_TYPE === 'cookie'){
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