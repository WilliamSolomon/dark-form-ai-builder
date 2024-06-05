import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const JsonForms=pgTable('forms', {
    id:serial('id').primaryKey(),
    jsonform:text('jsonform').notNull(),
    createdBy:varchar('createBy').notNull(),
    craetedAt:varchar('createdAt').notNull()
})