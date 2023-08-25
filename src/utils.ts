import {Request, Response} from 'express';
import {config} from 'dotenv'
import jwt from 'jsonwebtoken';
config()


export interface PayLoad{
    authorId: string;
    iat: number;
    exp: number;
}
export function createToken(id: string){
    const token = jwt.sign(
        {authorId: id},
        process.env.JWT_SECRET as string,
        {expiresIn: "2h"}
    )

    return token
}


export function verifyToken(req: Request){
    //get token from auth header or request cookies
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token

    //reject if no token found
    if(!token){
        return false
    }

    //decode token
    const decrypt = jwt.verify(token, process.env.JWT_SECRET as string) as PayLoad

    //reject if not decoded
    if(!decrypt){
        return false
    }

    //return decoded object
    return decrypt
}

export function getId(req: Request){
    //get decoded objet
    const decrypt = verifyToken(req)

    //reject if req not verified
    if(!decrypt){
        return false
    }

    //return authors id
    const {authorId} = decrypt
    return authorId
}