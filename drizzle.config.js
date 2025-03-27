import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.jsx',
  dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL || "postgresql://Expense-Tracker_owner:npg_PCAF25ZaLklr@ep-steep-cake-a88xxds5.eastus2.azure.neon.tech/Expense-Tracker?sslmode=require",
    },
});

// export default {
//   schema: "./db/schema.jsx", // Adjust this path if needed
//   out: "./drizzle", // Where migrations & generated types go
//   driver: "postgres",
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL, // Use environment variable
//   },
// };
