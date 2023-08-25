import { Request, Response, NextFunction } from "express";
import { Author } from "../model/author";
import { verifyToken, createToken } from "../utils";
import bcrypt from 'bcryptjs';

export async function login(req: Request, res: Response, next: NextFunction){
    //get input from request
    const userInput = req.body
    //if no email or no password provided reject
    if(!userInput.email || !userInput.password){
        return res.status(400).json({error: "Wrong Input"})
    }
    //convert to lowercase and trim space
    const trimmed = userInput.email.toLowerCase().trim()
    userInput.email = trimmed

    try{
        //find author with email
        const author = await Author.findOne({email: userInput.email})

        //reject if no author found
        if (!author){
            return res.status(400).json({error: "invalid credentials"})
        }
        //compare for password match
        const validPassword = bcrypt.compareSync(userInput.password, author.password)
        //reject if password does not match
        if(!validPassword){
            return res.status(400).json({error: "invalid credentials"})
        }

        //generate token for user and attach to requests
        const token = createToken(author._id.toString())
        req.headers.authorization = `Bearer ${token}`
        res.cookie("token", token, {httpOnly: true, maxAge: 36000000})

        //pass to next
        next()
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Server Error"})
    }

}

export async function authorise(req: Request, res: Response, next: NextFunction){
    //decode token from req
    const validUser = verifyToken(req)

    //reject if invalid
    if(!validUser){
        return res.status(403).json({error: "Unauthorised"})
    }

    //proceed 
    next()
}


