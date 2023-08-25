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
exports.authorise = exports.login = void 0;
const author_1 = require("../model/author");
const utils_1 = require("../utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //get input from request
        const userInput = req.body;
        //if no email or no password provided reject
        if (!userInput.email || !userInput.password) {
            return res.status(400).json({ error: "Wrong Input" });
        }
        //convert to lowercase and trim space
        const trimmed = userInput.email.toLowerCase().trim();
        userInput.email = trimmed;
        try {
            //find author with email
            const author = yield author_1.Author.findOne({ email: userInput.email });
            //reject if no author found
            if (!author) {
                return res.status(400).json({ error: "invalid credentials" });
            }
            //compare for password match
            const validPassword = bcryptjs_1.default.compareSync(userInput.password, author.password);
            //reject if password does not match
            if (!validPassword) {
                return res.status(400).json({ error: "invalid credentials" });
            }
            //generate token for user and attach to requests
            const token = (0, utils_1.createToken)(author._id.toString());
            req.headers.authorization = `Bearer ${token}`;
            res.cookie("token", token, { httpOnly: true, maxAge: 36000000 });
            //pass to next
            next();
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server Error" });
        }
    });
}
exports.login = login;
function authorise(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //decode token from req
        const validUser = (0, utils_1.verifyToken)(req);
        //reject if invalid
        if (!validUser) {
            return res.status(403).json({ error: "Unauthorised" });
        }
        //proceed 
        next();
    });
}
exports.authorise = authorise;
