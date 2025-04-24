'use client'

import { useEffect, useState } from 'react'

export default function SmartSuggestions({ expenses }) {
  const [suggestion, setSuggestion] = useState("Getting smart tips...")

  useEffect(() => {
    const fetchSuggestions = async () => {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses })
      })

      const data = await res.json()
      setSuggestion(data.suggestion)
    }

    fetchSuggestions()
  }, [expenses])

  return (
    <div className="p-4 mt-6 bg-white border rounded-md shadow">
      <h3 className="text-lg font-semibold mb-2">💡 Smart Suggestions</h3>
      <p className="text-gray-800 whitespace-pre-line">{suggestion}</p>
    </div>
  )
}