const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
} = require("../controllers/userController.js");

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Registrasi pengguna baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               address:
 *                 type: string
 *                 example: "123 Main Street"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request (e.g., email already exists)
 */
router.post("/register", registerUser);

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login pengguna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Success (returns JWT token)
 *       401:
 *         description: Unauthorized (invalid credentials)
 */
router.post("/login", loginUser);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Mendapatkan detail pengguna berdasarkan ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */
router.get("/:id", getUserById);

module.exports = router;
