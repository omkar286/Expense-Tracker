import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
// import nlp from 'compromise';
import { db } from '@utils/index';
import { Expenses } from '@utils/schema';

export async function POST(req) {
    const data = await req.formData();
    const file = data.get("file");
  
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
  
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
    // Auto-categorize logic (basic)
    const autoCategorized = jsonData.map((entry) => {
      const desc = entry.description?.toLowerCase() || "";
  
      let category = "Other";
      if (desc.includes("zomato") || desc.includes("swiggy")) category = "Food";
      else if (desc.includes("uber") || desc.includes("ola")) category = "Transport";
      else if (desc.includes("amazon") || desc.includes("flipkart")) category = "Shopping";
      return {
        date: entry.date,
        description: entry.description,
        amount: entry.amount,
        category,
      };
    });
    

    await db.insert(Expenses).values(parsedExpenses);

    return NextResponse.json({ data: autoCategorized });
}
