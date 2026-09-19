// src/services/userService.js
// import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

// Find a user by their email address
export async function findUserByEmail(email) {
  return await prisma.users.findUnique({ where: { email } });
}


