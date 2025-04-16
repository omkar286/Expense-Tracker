import { NextResponse } from 'next/server';
import { db } from '@utils/index';
import { Expenses } from '@utils/schema';

export async function POST(req) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    const payload = body.map((item) => ({
      date: item.date,
      name: item.name,
      amount: parseFloat(item.amount),
      createdAt: now,
      budgetId: null,
    }));

    await db.insert(Expenses).values(payload);

    return NextResponse.json({ message: "Saved to database", count: payload.length });
  } catch (error) {
    console.error("Save failed:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// import { NextResponse } from 'next/server';
// import { db } from '@utils/index';
// import { Expenses, Budgets } from '@utils/schema';
// import { eq } from 'drizzle-orm';
// import { useUser } from '@clerk/nextjs';


// // Utility: get or create budget by category name
// async function getOrCreateBudgetId(name) {
//   const lower = name.toLowerCase();
//   const { user } = useUser();
//   let category = 'Other';
//   let icon = '💸'; // Default icon
//   let defaultAmount = '0'; // Default budget amount

//   if (lower.includes('zomato') || lower.includes('swiggy')) {
//     category = 'Food';
//     icon = '🍔';
//   } else if (lower.includes('uber') || lower.includes('ola')) {
//     category = 'Transport';
//     icon = '🚗';
//   } else if (lower.includes('amazon') || lower.includes('flipkart')) {
//     category = 'Shopping';
//     icon = '🛍️';
//   } else if (lower.includes('electricity') || lower.includes('bill')) {
//     category = 'Utilities';
//     icon = '💡';
//   } else if (lower.includes('rent') || lower.includes('lease')) {
//     category = 'Housing';
//     icon = '🏠';
//   }

//   // Try to find existing budget
//   const existing = await db
//     .select()
//     .from(Budgets)
//     .where(eq(Budgets.name, category))
//     .limit(1);

//   if (existing.length > 0) {
//     return existing[0].id;
//   }

//   // Otherwise create it
//   const inserted = await db
//     .insert(Budgets)
//     .values({
//       name: category,
//       amount: defaultAmount,
//       icon: icon,
//       createdBy: user?.primaryEmailAddress?.emailAddress, // Set this based on your logic (user ID etc.)
//     })
//     .returning();

//   return inserted[0].id;
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const now = new Date().toISOString();

//     const payload = await Promise.all(
//       body.map(async (item) => {
//         const budgetId = await getOrCreateBudgetId(item.name);

//         return {
//           date: item.date,
//           name: item.name,
//           amount: parseFloat(item.amount),
//           createdAt: now,
//           budgetId,
//         };
//       })
//     );

//     await db.insert(Expenses).values(payload);

//     return NextResponse.json({ message: 'Saved to database', count: payload.length });
//   } catch (error) {
//     console.error('Save failed:', error);
//     return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
//   }
// }

