const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { urlencoded } = require("express");
const jwt = require("jsonwebtoken");

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  // Require user to enter both email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Provide both email and password",
    });
  }

  try {
    // Find user with specified email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check validity of entered password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    // Assign token to email
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "Success Logging In!",
      userId: user.id,  
      token,

    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
};

// Create user function
const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user entered all fields
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Enter all user fields",
    });
  }

  try {
    // Hash the password by 10 rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Generate token after user creation
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "User Created!",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(400).json({
        success: false,
        message: "Credentials already exist!",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
};

// Delete user function
const deleteUser = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Provide the email of the user to delete",
    });
  }

  try {
    const user = await prisma.user.delete({
      where: { email },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};


module.exports = { login, createUser, deleteUser };
