import express from 'express';
import { createBook, getBook } from '../controllers/book';

const router = express.Router()

router.post("/create", createBook)
router.get("/create", function(req, res, next){
    res.render("createBook", {title: "Lib | Add Book"})
})
router.get("/:id", getBook)

export default router