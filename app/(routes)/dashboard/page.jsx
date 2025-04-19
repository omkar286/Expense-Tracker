"use client"
import { UserButton, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import CardInfo from './_components/CardInfo';
import BarChartDashboard from './_components/BarChartDashboard'
import { db } from '@utils/index'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '@utils/schema'
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
import ImportUploader from './_components/ImportUploader';

function Dashboard() {
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
    <div >
      <div className='p-5'>
        <h2 className='font-bold text-3xl'>Hi, {user?.fullName}</h2>
        <p className='text-gray-500'>Lets Manage your Expenses</p>
        <CardInfo budgetList={budgetList}/>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 p-5'>
          <div className='md:col-span-2'>
            <BarChartDashboard
            budgetList={budgetList} />

            <ExpenseListTable
            expensesList={expensesList}
            refreshData={()=>getBudgetList()}
            />
            <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Import Expenses</h1>
      <ImportUploader />
    </div>
          </div>
          <div className='grid gap-3'>
            <h2 className='font-bold text-lg'>Latest Budgets</h2>
            {budgetList.map((budget,index)=>(
              <BudgetItem budget={budget} key={index} />
            ) )}

          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard