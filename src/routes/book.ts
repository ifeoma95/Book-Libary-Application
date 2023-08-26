import express from 'express';
import { createBook, getBook, getAll, updatePage, updateBook, deleteBook } from '../controllers/book';

const router = express.Router()

router.post("/create", createBook)
router.get("/create", function(req, res, next){
    res.render("createBook", {title: "Lib | Add Book"})
})

router.get("/:id", getBook)
router.get("/:id/update", updatePage)
router.post("/:id/update", updateBook)
router.post("/:id/delete", deleteBook)


export default router