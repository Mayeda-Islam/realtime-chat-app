// src/controllers/authController.js
import prisma from "../config/prisma.js";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,
  // findUserByUsername,
  createUser,
} from "../services/userService.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// ======================================================
// REGISTER
// ======================================================

export async function signup(req, res) {
  try {
    const { username, email, password_hash } = req.body;
    console.log(req.body, "req.body");
    // -----------------------------------------------
    // 1. Validate input
    // -----------------------------------------------

    if (!username || !email || !password_hash) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    // -----------------------------------------------
    // 2. Check username
    // -----------------------------------------------

    // const existingUsername =
    //   await findUserByUsername(username);

    // if (existingUsername) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Username is already taken",
    //   });
    // }

    // -----------------------------------------------
    // 3. Check email
    // -----------------------------------------------

    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }



    // -----------------------------------------------
    // 4. Create user
    // -----------------------------------------------

    const newUser = await createUser({
      username,
      email,
      password_hash,
    });
    // -----------------------------------------------
    // 5. Create JWT
    // -----------------------------------------------

    const token = jwt.sign(
      {
        id: newUser.id,
        username: username,
      },

      JWT_SECRET,

      {
        expiresIn: "1d",
      },
    );
    // -----------------------------------------------
    // 5. Return user information
    // -----------------------------------------------
    console.log(newUser, "newUser");
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
}

// ======================================================
// LOGIN
// ======================================================

export async function login(req, res) {
  try {
    const { email, password_hash } = req.body;

    // -----------------------------------------------
    // 1. Validate input
    // -----------------------------------------------

    if (!email || !password_hash) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // -----------------------------------------------
    // 2. Find user
    // -----------------------------------------------

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // -----------------------------------------------
    // 3. Compare password
    // -----------------------------------------------

    const isPasswordValid = password_hash === user.password_hash;

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // -----------------------------------------------
    // 4. Update online status
    // -----------------------------------------------

    await prisma.users.update({
      where: {
        id: user.id,
      },

      data: {
        is_online: true,
        last_seen: new Date(),
      },
    });

    // -----------------------------------------------
    // 5. Create JWT
    // -----------------------------------------------

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },

      JWT_SECRET,

      {
        expiresIn: "1d",
      },
    );

    // -----------------------------------------------
    // 6. Return response
    // -----------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        is_online: true,
        last_seen: new Date(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}

export async function logout(req, res) {
  try {
    // req.user.id আসছে আপনার ওই authMiddleware থেকে
    // এখানে শুধু ডাটাবেজে ইউজারের অনলাইন স্ট্যাটাস অফলাইন করে দেওয়া হচ্ছে
    await prisma.users.update({
      where: { id: req.user.id },
      data: { is_online: false },
    });

    // ফ্রন্টএন্ডকে একটা মেসেজ পাঠানো হচ্ছে যে ব্যাকএন্ডের কাজ শেষ
    res.json({
      success: true,
      message: "Logged out successfully from server.",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
