"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updatePage = exports.updateBook = exports.getAll = exports.getBook = exports.createBook = void 0;
const author_1 = require("../model/author");
const utils_1 = require("../utils");
const book_1 = require("../model/book");
function createBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //get book details from req body
        const { title, description, publisher, genre, pageCount, datePublished } = req.body;
        //get author id from req
        const authorId = (0, utils_1.getId)(req);
        //reject if no author id found
        if (!authorId) {
            return res.status(403).json({ error: "Please login" });
        }
        try {
            //find author by id
            const author = yield author_1.Author.findById(authorId);
            //reject if author not found
            if (!author) {
                return res.status(401).json({ error: "User not found" });
            }
            //create new book
            const newBook = yield book_1.Books.create({
                title,
                description: description || "none",
                publisher,
                genre,
                pageCount,
                datePublished,
                authorId
            });
            //reject if book not created
            if (!newBook) {
                return res.status(400).json({ error: "invalid input" });
            }
            //push book id into author's books field then save
            author.books.push(newBook._id);
            yield author.save();
            //respond with book details
            return res.redirect(`/users/d/books/${newBook._id.toString()}`);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}
exports.createBook = createBook;
function getBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //get book id from req parameters
        const id = req.params.id;
        try {
            if (id === "all") {
                yield getAll(req, res, next);
                return;
            }
            //find book by id
            const book = yield book_1.Books.findById(id);
            ///reject if book not found
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            //find author by id
            const author = yield author_1.Author.findById(book.authorId.toString());
            //set name dynamically
            let authorName = author ? author.authorName : "Unknown";
            const owner = (0, utils_1.ownsBook)(req, book.authorId.toString());
            if (owner) {
                //respond with book data and the author's name with owner options 
                return res.render("myBook", { title: "Lib | Book", data: book, author: authorName });
            }
            //respond with book data and the author's name without options
            return res.render("bookDetail", { title: "Lib | Book", data: book, author: authorName });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}
exports.getBook = getBook;
function getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const books = yield book_1.Books.find();
            if (!books.length) {
                res.render("bookList", {
                    title: "Lib | Books",
                    data: [{ title: "No books found" }]
                });
                return;
            }
            res.render("bookList", {
                title: "Lib | Books",
                data: books
            });
        }
        catch (err) {
            res.json({
                message: "Server error",
                error: err
            });
        }
    });
}
exports.getAll = getAll;
function updateBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const newData = req.body;
        try {
            const book = yield book_1.Books.findById(id);
            if (!book) {
                return res.status(404).json({
                    error: "Book not found"
                });
            }
            const owner = (0, utils_1.ownsBook)(req, book.authorId.toString());
            if (!owner) {
                return res.status(403).json({
                    error: "Reserved for book's author"
                });
            }
            for (const field in newData) {
                if (!newData[field]) {
                    delete newData[field];
                }
            }
            Object.assign(book, newData);
            yield book.save();
            res.redirect(`/users/d/books/${book._id.toString()}`);
        }
        catch (err) {
            res.status(500).json({
                message: "server error",
                error: err
            });
        }
    });
}
exports.updateBook = updateBook;
function updatePage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const book = yield book_1.Books.findById(id);
            if (!book) {
                return res.status(404).json({
                    error: "Book not found"
                });
            }
            const owner = (0, utils_1.ownsBook)(req, book.authorId.toString());
            if (!owner) {
                return res.status(403).json({
                    error: "Reserved for book's author"
                });
            }
            res.render("updateBook", {
                title: "Lib | Update",
            });
        }
        catch (err) {
            res.status(500).json({
                message: "server error",
                error: err
            });
        }
    });
}
exports.updatePage = updatePage;
function deleteBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const book = yield book_1.Books.findById(id);
            if (!book) {
                return res.status(404).json({
                    error: "Book not found"
                });
            }
            const owner = (0, utils_1.ownsBook)(req, book.authorId.toString());
            if (!owner) {
                return res.status(403).json({
                    error: "Reserved for book's author"
                });
            }
            yield book.deleteOne({ _id: id });
            res.redirect("/users/d/dashboard");
        }
        catch (err) {
            res.status(500).json({
                message: "server error",
                error: err
            });
        }
    });
}
exports.deleteBook = deleteBook;
