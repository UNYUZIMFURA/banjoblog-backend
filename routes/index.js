const express = require("express")
const { findAllBooks, saveBooks } = require("../controllers/books.controller")
const {createUser, login} = require("../controllers/auth.controller")
const router = express.Router()

router.get("/books", findAllBooks)
router.post("/books", saveBooks)
router.post("/auth/users", createUser)
router.post("/auth/login", login)


module.exports = router