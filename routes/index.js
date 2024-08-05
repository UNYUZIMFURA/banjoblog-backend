const express = require("express");
const {
  listPosts,
  addPost,
  editPost,
  deletePost,
} = require("../controllers/posts.controller");
const { createUser, login, deleteUser } = require("../controllers/users.controller");
const { authenticateToken } = require("../middlewares/authenticateToken");
const { addComment, editComment, deleteComment } = require("../controllers/comments.controller");

const router = express.Router();

// Users routes
/**
 * @swagger
 * /auth/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User creation error
 */
router.post("/auth/users", createUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Login error
 */
router.post("/auth/users/login", login);
router.delete("/auth/users", deleteUser)
router.get("/posts", listPosts);
router.post("/posts", authenticateToken, addPost);
router.put("/posts/:id", authenticateToken, editPost); 
router.delete("/posts/:id", authenticateToken, deletePost);
router.post("/comments/:id", authenticateToken, addComment)
router.put("/posts/:id", authenticateToken, editComment)
router.delete("/posts/:id", deleteComment)

module.exports = router;
