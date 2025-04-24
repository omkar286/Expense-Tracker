'use client'

import { useState } from 'react'

export default function ExportOptions() {
  const [range, setRange] = useState('monthly')

  const handleExport = async (type) => {
    const endpoint = type === 'csv' ? '/api/export/csv' : '/api/export/pdf'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ range })
    })

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `expenses-${range}.${type}`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 p-4 border rounded-md w-fit bg-white shadow">
      <label className="block text-sm font-medium text-gray-700">
        Select Time Range:
      </label>
      <select
        value={range}
        onChange={(e) => setRange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md"
      >
        <option value="weekly">Last 7 Days</option>
        <option value="monthly">Last 30 Days</option>
        <option value="yearly">Last 12 Months</option>
      </select>

      <div className="flex gap-4 pt-2">
        <button
          onClick={() => handleExport('csv')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export CSV
        </button>

        <button
          onClick={() => handleExport('pdf')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export PDF
        </button>
      </div>
    </div>
  )
}