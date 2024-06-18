const express = require("express")
const { findAllBooks, saveBooks } = require("../controllers/books.controller")
const {createUser} = require("../controllers/auth.controller")
const router = express.Router()

router.get("/books", findAllBooks)
router.post("/books", saveBooks)
router.post("/auth/users", createUser)
// router.post("/auth/")


module.exports = router