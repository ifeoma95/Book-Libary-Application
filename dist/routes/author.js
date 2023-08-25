"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const author_1 = require("../controllers/author");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.post('/signup', author_1.createAuthor);
router.post('/login', auth_1.login, author_1.getAuthor);
router.use('/d', auth_1.authorise);
router.get('/d/dashboard', author_1.getAuthor);
router.post('/d/update', author_1.updateAuthor);
router.post('/d/delete', author_1.deleteAuthor);
exports.default = router;
