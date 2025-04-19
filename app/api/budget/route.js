// app/api/budgets/route.js

import { NextResponse } from 'next/server';
import { db } from '@utils/index';
import { Budgets } from '@utils/schema';

export async function POST(req) {
  const body = await req.json();
  const { name, amount, icon, createdBy } = body;

  if (!createdBy) {
    return NextResponse.json({ error: 'Missing createdBy (email)' }, { status: 400 });
  }

  try {
    await db.insert(Budgets).values({
      name,
      amount,
      icon,
      createdBy,
    });

    return NextResponse.json({ message: 'Budget created successfully' });
  } catch (err) {
    console.error('Error inserting budget:', err);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
