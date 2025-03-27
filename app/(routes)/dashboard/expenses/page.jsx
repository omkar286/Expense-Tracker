'use client'
import React, { useEffect, useState } from 'react';
import { db } from '@utils/index'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '@utils/schema'
import BudgetItem from '../budgets/_components/BudgetItem';
import ExpenseListTable from '../expenses/_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';

function page() {

    const {user} = useUser();

const [budgetList,setBudgetList]=useState([]);
const [expensesList,setExpensesList]=useState([]);
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
      .orderBy(desc(Budgets.id))
      ;

  setBudgetList(result);
    GetAllExpenses();
};

const GetAllExpenses=async()=>{
  const result=await db.select({
    id:Expenses.id,
    name:Expenses.name,
    amount:Expenses.amount,
    createdAt:Expenses.createdAt
  }).from(Budgets)
  .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
  .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
  .orderBy(desc(Expenses.id))

  setExpensesList(result);
  console.log(result);
}
  return (
    <div className='p-5'><ExpenseListTable
    expensesList={expensesList}
    refreshData={()=>getBudgetList()}
    /></div>
  )
}

export default page