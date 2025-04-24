import { NextResponse } from 'next/server'
import { db } from '@utils/index'
import { Expenses } from '@utils/schema'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

export async function POST() {
  let allExpenses = []

  try {
    allExpenses = await db.select().from(Expenses)
  } catch (err) {
    console.error('DB error:', err)
    return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 })
  }

  const doc = new PDFDocument({ autoFirstPage: false })
  const chunks = []

  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf')

  if (!fs.existsSync(fontPath)) {
    console.error('Custom font not found at', fontPath)
    return NextResponse.json({ error: 'Custom font missing' }, { status: 500 })
  }

  doc.registerFont('custom', fontPath)
  doc.font('custom')

  doc.on('data', (chunk) => chunks.push(chunk))
  doc.on('end', () => {})

  doc.addPage()
  doc.fontSize(18).text('Expense Report\n\n', { underline: true })

  if (allExpenses.length === 0) {
    doc.fontSize(12).text('No expenses found.')
  } else {
    allExpenses.forEach((exp, index) => {
      const formattedDate = new Date(exp.date || exp.createdAt).toLocaleDateString()
      doc.fontSize(12).text(`${index + 1}. ₹${exp.amount} | ${exp.category || 'N/A'} | ${formattedDate}`)
    })
  }

  doc.end()

  await new Promise((resolve) => doc.on('end', resolve))
  const pdfBuffer = Buffer.concat(chunks)

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=expenses-all.pdf',
    },
  })
}
