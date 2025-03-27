// "use client";
// import React, { useEffect, useState, use } from "react";
// import { useUser } from "@clerk/nextjs";
// import { eq, sql } from "drizzle-orm";
// import { db } from "db/index";
// import { Budgets, Expenses } from "db/schema";
// import { useParams } from "next/navigation";

// function ExpensesPage() {
//   const { user } = useUser();
//   const params = use(useParams()); // ✅ Unwrap `params` using `use()`
//   const [budgetInfo, setbudgetInfo] = useState(null);

//   useEffect(() => {
//     if (user && params?.id) {
//       getbudgetInfo();
//     }
//   }, [user, params?.id]);

//   const getbudgetInfo = async () => {
//     try {
//       console.log("Fetching budget for ID:", params.id);

//       const result = await db
//         .select({
//           ...Budgets,
//           totalSpends: sql`SUM(${Expenses.amount})`.mapWith(Number),
//           totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
//         })
//         .from(Budgets)
//         .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
//         .where(eq(Budgets.createdBy, user.primaryEmailAddress?.emailAddress))
//         .where(eq(Budgets.id, params.id)) // ✅ Now params.id is correctly unwrapped
//         .groupBy(Budgets.id);

//       console.log("Budget Query Result:", result);
//       setbudgetInfo(result);
//     } catch (error) {
//       console.error("Error fetching budget data:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Budget Details</h1>
//       {budgetInfo ? <pre>{JSON.stringify(budgetInfo, null, 2)}</pre> : <p>Loading...</p>}
//     </div>
//   );
// }

// export default ExpensesPage;

"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "db/index";
import { Budgets, Expenses } from "db/schema";
import { useParams, useRouter } from "next/navigation";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense"
import EditBudget from "../_components/EditBudget"

import ExpenseListTable from "../_components/ExpenseListTable"
import { Button } from "@components/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/components/ui/alert-dialog";
import { toast } from "sonner";


function ExpensesPage() {
  const { user } = useUser();
  const params = useParams();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    if (user && params?.id) {
      const budgetId = parseInt(params.id, 10); // ✅ Ensure it's an integer
      if (!isNaN(budgetId)) {
        getbudgetInfo(budgetId);
      } else {
        console.error("Invalid budget ID:", params.id);
      }
    }
  }, [user, params?.id]);



  const getbudgetInfo = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`SUM(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .where(eq(Budgets.id, params.id)) // ✅ Pass a valid integer
      .groupBy(Budgets.id);
    setBudgetInfo(result[0]);
    getExpensesList();

  }

  const getExpensesList = async () => {
    const result = await db.select().from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpensesList(result)

    console.log(result)
  }

  const deleteBudget = async () => {

    const deleteExpenseResult = await db.delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))

    if (deleteExpenseResult) {
      const result = await db.delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();
    }

    toast('Budget Deleted!')
    route.replace('/dashboard/budgets')



  }


  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={()=>route.back()} className="cursor-pointer"/>
         My Expenses
        </span>

        <div className="flex gap-2 items-center">
          <EditBudget budgetInfo={budgetInfo}
          refreshData={()=>getbudgetInfo()
          } />
        

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2" variant="destructive">
              <Trash />Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your current budget along with expenses
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>



      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ?
          <BudgetItem budget={budgetInfo} />
          :
          <div className="h-[150px] w-full bg-gray-200 rounded-lg animate-pulse"></div>
        }
        <AddExpense budgetId={params.id}
          user={user}
          refreshData={() => getbudgetInfo()}
        />
      </div>
      <div className="mt-4">
        
        <ExpenseListTable expensesList={expensesList}
          refreshData={() => getbudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesPage;

