import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  const parsed = jsonData.map((entry) => ({
    date: entry.date,
    name: entry.name || entry.description || "Unnamed Expense",
    amount: entry.amount,
  }));

  return NextResponse.json({ data: parsed });
}