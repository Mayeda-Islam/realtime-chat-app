// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/userService.js";

// import { findUserByEmail, createUser } from "../services/userService.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// export async function signup(req, res) {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ success: false, message: "All fields are required" });
//   }

//   try {
//     const existingUser = await findUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Email is already registered" });
//     }

//     const newUser = await createUser({ username, email, password });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully!",
//       userId: newUser.id
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

export async function login(req, res) {
  const { email, password_hash } = req.body;

  if (!email || !password_hash) {
    console.log(email, password_hash);
    return res
      .status(400)
      .json({
        success: false,
        message: `${email} ${password_hash} is required`,
      });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email " });
    }

    const isPasswordValid = password_hash === user.password_hash;
    // console.log(user);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid  password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
