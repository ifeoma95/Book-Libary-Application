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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuthor = exports.updateAuthor = exports.getAuthor = exports.createAuthor = void 0;
const author_1 = require("../model/author");
const utils_1 = require("../utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function createAuthor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //get input from body
        const { name, email, password, phoneNumber } = req.body;
        try {
            //create new author
            const hashed = bcryptjs_1.default.hashSync(password, 10);
            const newAuthor = yield author_1.Author.create({
                authorName: name,
                email: email.toLowerCase().trim(),
                password: hashed,
                phoneNumber,
            });
            //reject if author is not created
            if (!newAuthor) {
                return res.status(400).json({ error: "invalid input" });
            }
            //generate token and attach to req
            const token = (0, utils_1.createToken)(newAuthor._id.toString());
            req.headers.authorization = `Bearer ${token}`;
            res.cookie("token", token, { httpOnly: true, maxAge: 36000000 });
            //redirect to dashboard
            res.redirect("/users/d/dashboard");
            return;
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}
exports.createAuthor = createAuthor;
function getAuthor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //get id from request
        const _id = (0, utils_1.getId)(req);
        //reject if id not retrieved
        if (!_id) {
            return res.status(403).json({ error: "Please login" });
        }
        try {
            //find author by id
            const author = yield author_1.Author.findById(_id);
            //reject if author not found
            if (!author) {
                return res.status(403).json({ error: "Please login" });
            }
            //welcome author with name
            res.json({ message: `Welcome ${author.authorName}` });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}
exports.getAuthor = getAuthor;
function updateAuthor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //get input from req body
        const userInput = req.body;
        //get id from req
        const _id = (0, utils_1.getId)(req);
        //reject if id not found
        if (!_id) {
            return res.status(403).json({ error: "Please login" });
        }
        try {
            //find author
            const author = yield author_1.Author.findById(_id);
            //reject if author not found
            if (!author) {
                return res.status(403).json({ error: "Please login" });
            }
            //remove empty/undefined fields from input body
            for (const field in userInput) {
                if (!userInput[field]) {
                    delete userInput[field];
                }
            }
            //replace fields in author data
            Object.assign(author, userInput);
            //save new data
            yield author.save();
            //respond with author details
            res.json({ data: author });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}
exports.updateAuthor = updateAuthor;
function deleteAuthor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const _id = (0, utils_1.getId)(req);
        if (!_id) {
            return res.status(403).json({ error: "Please login" });
        }
        try {
            const author = yield author_1.Author.findById(_id);
            //reject if author not found
            if (!author) {
                return res.status(403).json({ error: "Please login" });
            }
            yield author.deleteOne();
            return res.json({ message: "You have been removed" });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "server error" });
        }
    });
}
exports.deleteAuthor = deleteAuthor;
