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
exports.getBook = exports.createBook = void 0;
const author_1 = require("../model/author");
const utils_1 = require("../utils");
const book_1 = require("../model/book");
function createBook(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, publisher, genre, pageCount, datePublished } = req.body;
        const authorId = (0, utils_1.getId)(req);
        if (!authorId) {
            return res.status(403).json({ error: "Please login" });
        }
        try {
            const newBook = yield book_1.Books.create({
                title,
                description,
                publisher,
                genre,
                pageCount,
                datePublished,
                authorId
            });
            if (!newBook) {
                return res.status(400).json({ error: "invalid input" });
            }
            const author = yield author_1.Author.findById(authorId);
            if (!author) {
                return res.status(401).json({ error: "Book has not added to your collection" });
            }
            author.books.push(newBook._id);
            yield author.save();
            return res.json({ message: "created", data: newBook });
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
        const id = req.params.id;
        try {
            const book = yield book_1.Books.findById(id);
            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }
            const author = yield author_1.Author.findById(book.authorId.toString());
            let authorName = author ? author.authorName : "Unknown";
            return res.json({ data: book, author: authorName });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}
exports.getBook = getBook;
