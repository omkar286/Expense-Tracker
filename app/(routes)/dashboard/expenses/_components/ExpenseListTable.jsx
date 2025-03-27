import { Trash } from 'lucide-react'
import React from 'react'
import { db } from '@utils/index';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Expenses } from '@utils/schema';
import { toast } from 'sonner';


function ExpenseListTable({ expensesList, refreshData }) {
    const deleteExpense = async (expenses) => {
        const result = await db.delete(Expenses)
            .where(eq(Expenses.id, expenses.id))
            .returning();

        if (result) {
            toast('Expense Deleted!');
            refreshData()
        }
    }

    return (
        <div className='mt-3'>
            <h2 className="font-bold text-lg" >LatestExpenses</h2>
            <div className='grid grid-cols-4 bg-gray-200 p-2 mt-3'>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>

            </div>
            {expensesList.map((expenses) => (
                <div key={expenses.id} className='grid grid-cols-4 bg-gray-50 p-2'>
                    <h2>{expenses.name}</h2>
                    <h2>{expenses.amount}</h2>
                    <h2>{expenses.createdAt}</h2>
                    <h2>
                        <Trash className='text-red-600 cursor-pointer'
                            onClick={() => deleteExpense(expenses)}
                        />
                    </h2>
                </div>
            ))}

        </div>
    )
}

export default ExpenseListTable

