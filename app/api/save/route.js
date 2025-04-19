// app/api/save/route.js

import { NextResponse } from 'next/server';
import { db } from '@utils/index';
import { Budgets, Expenses } from '@utils/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req) {
  try {
    const { data, userEmail } = await req.json();

    if (!userEmail) {
      return NextResponse.json({ error: 'Missing userEmail in request' }, { status: 400 });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const payload = await Promise.all(
      data.map(async (item) => {
        const budgetId = await getOrCreateBudgetId(item.name, userEmail);
        return {
          date: item.date,
          name: item.name,
          amount: parseFloat(item.amount),
          createdAt: now,
          budgetId,
        };
      })
    );

    await db.insert(Expenses).values(payload);

    return NextResponse.json({ message: 'Saved to database', count: payload.length });
  } catch (error) {
    console.error('Save failed:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

async function getOrCreateBudgetId(name, userEmail) {
  const lower = name.toLowerCase();
  let category = 'Other', icon = '💸';

  if (lower.includes('zomato') || lower.includes('swiggy')) {
    category = 'Food'; icon = '🍔';
  } else if (lower.includes('uber') || lower.includes('ola')) {
    category = 'Transport'; icon = '🚗';
  } else if (lower.includes('amazon') || lower.includes('flipkart')) {
    category = 'Shopping'; icon = '🛍️';
  } else if (lower.includes('electricity') || lower.includes('bill')) {
    category = 'Utilities'; icon = '💡';
  } else if (lower.includes('rent') || lower.includes('lease')) {
    category = 'Housing'; icon = '🏠';
  }

  const existing = await db
    .select()
    .from(Budgets)
    .where(and(eq(Budgets.name, category), eq(Budgets.createdBy, userEmail)))
    .limit(1);

  if (existing.length > 0) return existing[0].id;

  const inserted = await db
    .insert(Budgets)
    .values({
      name: category,
      amount: '5000',
      icon,
      createdBy: userEmail,
    })
    .returning({ insertedId: Budgets.id });

  return inserted[0].insertedId;
}
