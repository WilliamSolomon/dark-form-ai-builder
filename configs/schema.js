const { pgTable, serial, text, varchar, integer, boolean } = require("drizzle-orm/pg-core");

export const JsonForms=pgTable('jsonForms', {
    id:serial('id').primaryKey(),
    jsonform:text('jsonform').notNull(),
    theme:varchar('theme'),
    background:varchar('background'),
    style:varchar('style'),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt').notNull(),
    requireSignIn:boolean('requireSignIn').default(false)
})

export const UserResponses=pgTable('userResponses',{
    id:serial('id').primaryKey(),
    jsonResponse:text('jsonResponse').notNull(),
    createdBy:varchar('createdBy').default('anonymous'),
    createdAt:varchar('createdAt').notNull(),
    formRef:integer('formRef').references(()=>JsonForms.id, {onDelete: 'cascade'}) 
});