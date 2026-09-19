import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma 7 CLI uses this URL directly for introspection (db pull) and migrations.
    // By passing DIRECT_URL here, we bypass the transaction pooler that causes the hang.
    url: env("DIRECT_URL"), 
  },
});
