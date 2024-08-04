const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const listPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
          include: {
            comments: {
                include: {
                  user: {
                    select: {
                      username: true,
                    },
                  },
                },   
            },
            user: {
              select: {
                username: true,
              },
            },
          },
        });
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

const editPost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({
      success: false,
      message: "No fields to update",
    });
  }

  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error updating post",
    });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error deleting post",
    });
  }
};


module.exports = {listPosts, addPost, editPost, deletePost}