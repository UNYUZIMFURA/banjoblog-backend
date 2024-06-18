const express = require("express")
const { findAllBooks, saveBooks } = require("../controllers/books.controller")
const router = express.Router()

router.get("/books", findAllBooks)
router.post("books", saveBooks)


module.exports = router