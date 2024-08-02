const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const listPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany(
            {
                include: {
                    comments: true,
                }
            }
        )
        return res.status(200).json({
            success: true,
            message: "Posts fetched!",
            posts
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error fetching posts"
        })
    }
}


const addPost = async (req, res) => {
    const { title, content, } = req.body
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: "Enter all Post Details!"
        })
    }
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                userId: req.user.id
            }
        })
        return res.status(200).json({
            success: true,
            message: "Post added Successfully",
            post
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Error Saving Post"
        })
    }
}

module.exports = {listPosts, addPost}