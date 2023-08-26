"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_1 = require("../controllers/book");
const router = express_1.default.Router();
router.post("/create", book_1.createBook);
router.get("/create", function (req, res, next) {
    res.render("createBook", { title: "Lib | Add Book" });
});
router.get("/:id", book_1.getBook);
router.get("/:id/update", book_1.updatePage);
router.post("/:id/update", book_1.updateBook);
router.post("/:id/delete", book_1.deleteBook);
exports.default = router;
