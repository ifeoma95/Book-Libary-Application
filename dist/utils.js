"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getId = exports.verifyToken = exports.createToken = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
(0, dotenv_1.config)();
function createToken(id) {
    const token = jsonwebtoken_1.default.sign({ authorId: id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return token;
}
exports.createToken = createToken;
function verifyToken(req) {
    var _a;
    //get token from auth header or request cookies
    const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]) || req.cookies.token;
    //reject if no token found
    if (!token) {
        return false;
    }
    //decode token
    const decrypt = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    //reject if not decoded
    if (!decrypt) {
        return false;
    }
    //return decoded object
    return decrypt;
}
exports.verifyToken = verifyToken;
function getId(req) {
    //get decoded objet
    const decrypt = verifyToken(req);
    //reject if req not verified
    if (!decrypt) {
        return false;
    }
    //return authors id
    const { authorId } = decrypt;
    return authorId;
}
exports.getId = getId;
