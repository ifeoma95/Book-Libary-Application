import { Request, Response, NextFunction } from "express";
import { Author } from "../model/author";
import { createToken, getId } from "../utils";
import { Books } from "../model/book";


export async function createBook(req: Request, res: Response, next: NextFunction){
    //get book details from req body
    const {title, description, publisher, genre, pageCount, datePublished} = req.body
    //get author id from req
    const authorId = getId(req)

    //reject if no author id found
    if(!authorId){
        return res.status(403).json({error: "Please login"})
    }
    try{

        //find author by id
        const author = await Author.findById(authorId)

        //reject if author not found
        if(!author){
            return res.status(401).json({error: "User not found"})
        }

        //create new book
        const newBook = await Books.create({
            title,
            description,
            publisher,
            genre,
            pageCount,
            datePublished,
            authorId
        })

        //reject if book not created
        if(!newBook){
            return res.status(400).json({error: "invalid input"})

        }

        //push book id into author's books field then save
        author.books.push(newBook._id)
        await author.save()

        //respond with book details
        return res.json({message: "created", data: newBook})
    }
    catch(err){
        console.error(err)
        res.status(500).json({error: "server error"})
    }
}

export async function getBook(req: Request, res: Response, next: NextFunction){
    //get book id from req parameters
    const id = req.params.id
    try{
        //find book by id
        const book = await Books.findById(id)

        ///reject if book not found
        if(!book){
            return res.status(404).json({error: "Book not found"})
        }
        //find author by id
        const author = await Author.findById(book.authorId.toString())
        
        //set name dynamically
        let authorName = author? author.authorName : "Unknown"

        //respond with book data and the author's name
        return res.json({data: book, author: authorName})
    }
    catch(err){
        console.error(err)
        res.status(500).json({error: "server error"})
    }
}