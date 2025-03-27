import { serial, text, pgTable, varchar, numeric, integer } from "drizzle-orm/pg-core";


export const Budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: varchar('amount').notNull(),
  icon:varchar('icon'),
  createdBy:varchar('createdBy').notNull()
});

export const Expenses =pgTable('expenses',{
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount').notNull(),
  budgetId: integer('budgetId').references(()=>Budgets.id),
  createdAt:varchar('createdAt').notNull()
})
  