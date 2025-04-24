import { NextResponse } from 'next/server'

export async function POST(req) {
  const { expenses } = await req.json()

  if (!Array.isArray(expenses)) {
    console.error("Invalid expenses input:", expenses)
    return NextResponse.json(
      { suggestion: "Invalid expenses format provided." },
      { status: 400 }
    )
  }

  const summary = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + Number(exp.amount || 0)
    return acc
  }, {})

  const prompt = `
You are a helpful personal finance assistant.
Based on this user's categorized expense summary (in ₹), provide 2-3 friendly, helpful money-saving suggestions.
Avoid repeating the raw numbers, and instead provide clear, practical advice.

Summary: ${JSON.stringify(summary)}
`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    })

    const data = await response.json()
    const suggestion = data.choices?.[0]?.message?.content || "No suggestions generated."

    return NextResponse.json({ suggestion })

  } catch (err) {
    console.error("OpenAI error:", err)
    return NextResponse.json({ suggestion: "Failed to get suggestions." }, { status: 500 })
  }
}
