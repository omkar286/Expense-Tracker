'use client'
import React, { useEffect, useState } from 'react';
import { db } from '@utils/index';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@utils/schema';
import ExpenseListTable from '../expenses/_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import ExportPdf from '../_components/ExportPdf';
import SmartSuggestions from '../_components/SmartSuggestion';

function Page() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [expenses, setExpenses] = useState([]); // ✅ New state for formatted expenses

  useEffect(()=>{
    user&&getBudgetList();
  },[user])

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    GetAllExpenses();
  };

  const GetAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);

    const formattedExpenses = result.map(item => ({
      name: item.name || 'Uncategorized',
      amount: item.amount || 0,
    }));
    
  };

  return (
    <div className='p-5'>
      <ExportPdf />
      <SmartSuggestions expenses={expenses} />
      <ExpenseListTable
        expensesList={expensesList}
        refreshData={() => getBudgetList()}
      />
    </div>
  );
}

export default Page;
