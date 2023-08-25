import { Request, Response, NextFunction } from "express";
import { Author } from "../model/author";
import { createToken, getId } from "../utils";
import bcrypt from 'bcryptjs';


export async function createAuthor(req: Request, res: Response, next: NextFunction){
    //get input from body
    const {name, email, password, phoneNumber} = req.body
    try{
        //create new author
        const hashed = bcrypt.hashSync(password, 10)
        const newAuthor = await Author.create({
            authorName: name,
            email: email.toLowerCase().trim(),
            password: hashed,
            phoneNumber,
        })

        //reject if author is not created
        if(!newAuthor){
            return res.status(400).json({error: "invalid input"})
        }

        //generate token and attach to req
        const token = createToken(newAuthor._id.toString())
        req.headers.authorization = `Bearer ${token}`
        res.cookie("token", token, {httpOnly: true, maxAge: 36000000})


        //redirect to dashboard
        res.redirect("/users/d/dashboard")
        return

    }
    catch(err){
        console.error(err)
        res.status(500).json({error: "server error"})
    }
}

export async function getAuthor(req: Request, res: Response, next: NextFunction){
    //get id from request
    const _id = getId(req)
    //reject if id not retrieved
    if(!_id){
        return res.status(403).json({error: "Please login"})
    }

    try{
        //find author by id
        const author = await Author.findById(_id)

        //reject if author not found
        if(!author){
            return res.status(403).json({error: "Please login"})
        }

        //welcome author with name
        res.json({message: `Welcome ${author.authorName}`})

    }
    catch(err){
        console.error(err)
        res.status(500).json({error: "server error"})
    } 
}

export async function updateAuthor(req: Request, res: Response, next: NextFunction){
    //get input from req body
    const userInput = req.body
    //get id from req
    const _id = getId(req)

    //reject if id not found
    if(!_id){
        return res.status(403).json({error: "Please login"})
    }
    try{
        //find author
        const author = await Author.findById(_id)

        //reject if author not found
        if(!author){
            return res.status(403).json({error: "Please login"})
        }

        //remove empty/undefined fields from input body
        for(const field in userInput){
            if(!userInput[field]){
                delete userInput[field]
            }
        }

        //replace fields in author data
        Object.assign(author, userInput)
        //save new data
        await author.save()

        //respond with author details
        res.json({data: author})
    }
    catch(err){
        console.error(err)
        res.status(500).json({error: "server error"})
    }
}

export async function deleteAuthor(req: Request, res: Response, next: NextFunction){
    const _id = getId(req)

    if(!_id){
        return res.status(403).json({error: "Please login"})
    }

    try{
        const author = await Author.findById(_id)

        //reject if author not found
        if(!author){
            return res.status(403).json({error: "Please login"})
        }

        await author.deleteOne()

        return res.json({message: "You have been removed"})

    }
    catch(err){
        console.error(err)
        res.status(500).json({error: "server error"})
    }
}