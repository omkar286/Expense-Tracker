// import { drizzle } from 'drizzle-orm/neon-http';

// const db = drizzle(process.env.DATABASE_URL);
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon('postgresql://Expense-Tracker_owner:npg_PCAF25ZaLklr@ep-steep-cake-a88xxds5.eastus2.azure.neon.tech/Expense-Tracker?sslmode=require');
export const db = drizzle({ client: sql });
