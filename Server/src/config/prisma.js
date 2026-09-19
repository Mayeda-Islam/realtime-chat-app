// src/config/prisma.js
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../generated/prisma/index.js"; 

const connectionString = process.env.DATABASE_URL;

// ডেটাবেজ ইউআরএল লোড না হলে ডেভলপমেন্টের সুবিধার্থে এরর থ্রো করবে
if (!connectionString) {
  throw new Error("❌ Error: DATABASE_URL is missing from process.env! Check your .env file.");
}

const pool = new pg.Pool({ 
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter }); 

export default prisma;
