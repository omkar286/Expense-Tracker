'use client';

import { useState } from 'react';

export default function ImportUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/import", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setPreview(result.data);
  };

  return (
    <div className="p-4 border rounded-xl space-y-4">
      <input
        type="file"
        accept=".csv, .xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload & Categorize
      </button>

      {preview.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Preview:</h3>
          <ul className="max-h-64 overflow-y-auto text-sm">
            {preview.map((item, i) => (
              <li key={i}>
                {item.date} | {item.description} | ₹{item.amount} | {item.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
