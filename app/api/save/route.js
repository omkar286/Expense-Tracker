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