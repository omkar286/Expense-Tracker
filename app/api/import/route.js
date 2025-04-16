import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import nlp from 'compromise';
import { db } from '@utils/index';
import { Expenses } from '@utils/schema';

function categorize(description) {
  const doc = nlp(description.toLowerCase());

  if (doc.has('zomato') || doc.has('swiggy')) return 'Food';
  if (doc.has('uber') || doc.has('ola') || doc.has('taxi')) return 'Transport';
  if (doc.has('flipkart') || doc.has('amazon')) return 'Shopping';
  if (doc.has('rent') || doc.has('lease')) return 'Housing';
  if (doc.has('electricity') || doc.has('bill') || doc.has('recharge')) return 'Utilities';

  return 'Other';
}

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const parsedExpenses = jsonData.map((entry) => {
      const name = entry.description || entry.name || 'Unnamed Expense';
      const amount = parseFloat(entry.amount) || 0;
      const date = entry.date
        ? new Date(entry.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return {
        date,
        name,
        amount,
        category: categorize(name),
        budgetId: null,
        createdAt: new Date().toISOString(),
      };
    });

    await db.insert(Expenses).values(parsedExpenses);

    return NextResponse.json({
      message: "Imported successfully",
      count: parsedExpenses.length,
    });
  } catch (error) {
    console.error("Import failed:", error);
    return NextResponse.json({ error: "Import failed", details: error }, { status: 500 });
  }
}
