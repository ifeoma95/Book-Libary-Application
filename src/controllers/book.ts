import { Request, Response, NextFunction } from "express";
import { Author } from "../model/author";
import { createToken, getId, ownsBook } from "../utils";
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
            description: description || "none",
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
        return res.redirect(`/users/d/books/${newBook._id.toString()}`)
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
        if(id === "all"){
            await getAll(req, res, next)
            return
        }
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

        const owner = ownsBook(req, book.authorId.toString())
        if(owner){
            //respond with book data and the author's name with owner options 
            return res.render("myBook",{title: "Lib | Book",data: book, author: authorName})
        }

        //respond with book data and the author's name without options
        return res.render("bookDetail",{title: "Lib | Book",data: book, author: authorName})
    }
    catch(err){
        console.error(err)
        res.status(500).json({error: "server error"})
    }
}

export async function getAll(req: Request, res: Response, next: NextFunction){
    try{
        const books = await Books.find()
        if(!books.length){
            res.render("bookList", {
                title: "Lib | Books",
                data: [{title: "No books found"}]
            })
            return
        }
        res.render("bookList", {
            title: "Lib | Books",
            data: books
        })
    }catch(err){
        res.json({
            message: "Server error",
            error: err
        })
    }
}

export async function updateBook(req: Request, res: Response, next: NextFunction){
    const id = req.params.id
    const newData = req.body
    try{
        const book = await Books.findById(id)
        if(!book){
            return res.status(404).json({
                error: "Book not found"
            })
        }
        const owner = ownsBook(req, book.authorId.toString())
        if(!owner){
            return res.status(403).json({
                error: "Reserved for book's author"
            })
        }

        for(const field in newData){
            if(!newData[field]){
                delete newData[field]
            }
        }

        Object.assign(book, newData)
        await book.save()

        res.redirect(`/users/d/books/${book._id.toString()}`)
    }
    catch(err){
        res.status(500).json({
            message: "server error",
            error: err
        })
    }
}
export async function updatePage(req: Request, res: Response, next: NextFunction){
    const id = req.params.id
    try{
        const book = await Books.findById(id)
        if(!book){
            return res.status(404).json({
                error: "Book not found"
            })
        }
        const owner = ownsBook(req, book.authorId.toString())
        if(!owner){
            return res.status(403).json({
                error: "Reserved for book's author"
            })
        }

        res.render("updateBook", {
            title: "Lib | Update",
        })
    }
    catch(err){
        res.status(500).json({
            message: "server error",
            error: err
        })
    }
}

export async function deleteBook(req: Request, res: Response, next: NextFunction){
    const id = req.params.id
    try{
        const book = await Books.findById(id)
        if(!book){
            return res.status(404).json({
                error: "Book not found"
            })
        }
        const owner = ownsBook(req, book.authorId.toString())
        if(!owner){
            return res.status(403).json({
                error: "Reserved for book's author"
            })
        }

        await book.deleteOne({_id: id})
        res.redirect("/users/d/dashboard")
    }
    catch(err){
        res.status(500).json({
            message: "server error",
            error: err
        })
    }
}