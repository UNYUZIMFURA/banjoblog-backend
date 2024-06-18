const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Provide both email and password",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(400).json({
      success: false,
      message: "Incorrect Password",
    });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET);

  return res.status(200).json({
    success: true,
    message: "Success Logging In!",
    token,
  });
};

const signupUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if user entered all fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Enter all fields",
    });
  }

  // Hash the password by 10 rounds
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
      }
    })
    return res.status(200).json({
      success: true,
      message: "User Created!",
      user,
      token,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: "Email already exists!"
      })
    }
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

module.exports = { login, signupUser };