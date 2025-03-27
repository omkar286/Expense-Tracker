import Link from 'next/link'
import React from 'react'

function BudgetItem({ budget }) {

    const calculateProgress = ()=>{

        const prec = (budget.totalSpend/budget.amount)*100;
        return prec.toFixed(2);
    }
    return (
        <Link href={'/dashboard/expenses/'+budget.id}  >
            <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>

            
            <div className='flex gap-2 items-center justify-between'>
                <div className='flex gap-2 items-center'>
                    <h2 className='text-2xl px-4 p-3 bg-gray-100 rounded-full '>
                        {budget?.icon}
                    </h2>
                    <div>
                        <h2 className='font-bold'>
                            {budget.name}
                        </h2>
                        <h2 className='text-sm text-gray-500'>
                            {budget.totalItem} Item
                        </h2>
                    </div>
                </div>
                <h2 className='font-bold text-primary text-lg'>
                    ₹{budget.amount}
                </h2>
            </div>
            <div className='mt-5'>
                <div className='flex items-center justify-between mb-2'>
                    <h2 className='text-xs text-gray-400'>
                        ₹{budget.totalSpend?budget.totalSpend:0} Spend
                    </h2>
                    <h2 className='text-xs text-gray-400'>
                        ₹{budget.amount-budget.totalSpend} Remaining
                    </h2>
                </div>
                <div className='w-full bg-gray-300 h-2 rounded-full'>
                    <div className=' bg-primary h-2 rounded-full'
                    style={{width:`${calculateProgress()}%`}}
                    >
                    </div>
                </div>
            </div>
            </div>
        </Link>
    )
}

export default BudgetItem

