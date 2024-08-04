const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add a new comment to a post
const addComment = async (req, res) => {
 const { id: postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Content is required!",
    });
  }

  try {
     const comment = await prisma.comment.create({
       data: {
         content,
         post: {
           connect: { id: postId },
         },
         user: {
           connect: { id: req.user.id },
         },
       },
     });

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error adding comment",
    });
  }
};

// Edit a comment
const editComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      success: false,
      message: "Content is required!",
    });
  }

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error updating comment",
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error deleting comment",
    });
  }
};

module.exports = { addComment, editComment, deleteComment };
