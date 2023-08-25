"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Book Lib' });
});
router.get('/login', function (req, res, next) {
    res.render('login', { title: "Lib | Login" });
});
router.get('/signup', function (req, res, next) {
    res.render('register', { title: "Lib | Signup" });
});
router.post("/", function (req, res, next) {
    req.headers.authorization = undefined;
    res.clearCookie("token");
    res.redirect("/");
});
exports.default = router;
