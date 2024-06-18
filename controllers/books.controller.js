const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const findAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany()
        return res.status(200).json({
            success: true,
            message: "Books fetched!",
            books
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error fetching books"
        })
    }
}

const saveBooks = async (req, res) => {
    const { name, author, publisher, publicationYear, subject } = req.body
    if (!name || !author || !publisher || !publicationYear || !subject) {
        return res.status(400).json({
            success: false,
            message: "Enter all Book Details!"
        })
    }
    try {
        const book = await prisma.book.create({
            data: {
                name,
                author,
                publisher,
                publicationYear,
                subject
            }
        })
        return res.status(200).json({
            success: true,
            message: "Book Saved Successfully",
            book
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error Saving Books"
        })
    }
}

module.exports = { findAllBooks, saveBooks }