import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
    schema: "./configs/schema.js",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL_CONFIG,
    }
});