// src/services/userService.js
// import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

// Find a user by their email address
export async function findUserByEmail(email) {
  return await prisma.users.findUnique({ where: { email } });
}

// Create new user
export async function createUser({ username, email, password_hash }) {
  // Hash password before saving it

  const user = await prisma.users.create({
    data: {
      username,
      email,
      password_hash: password_hash,
      avatar: "",
      is_online: true,
      last_seen: new Date(),
    },

    // Don't return password_hash
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      is_online: true,
      last_seen: true,
      created_at: true,
    },
  });

  return user;
}

