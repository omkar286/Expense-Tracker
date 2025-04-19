'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ImportUploader() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    // ✅ Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage("❌ Unsupported file type. Please upload .csv or .xlsx");
      return;
    }

    setLoading(true);
    setMessage(null);
    setPreview([]);
    setSaveMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        if (!result.data || result.data.length === 0) {
          setMessage("❌ File is empty or unreadable.");
        } else {
          setMessage(`✅ Imported ${result.data.length} rows`);
          setPreview(result.data);
        }
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch {
      setMessage("❌ An unexpected error occurred.");
    }

    setLoading(false);
  };

  const handleSaveToDB = async () => {
    if (preview.length === 0) return;

    if (!userEmail) {
      setSaveMessage("❌ Please log in to save data.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to save this data to the database?");
    if (!confirmed) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/save", {
        method: "POST",
        body: JSON.stringify({ data: preview, userEmail }), // ✅ Pass userEmail
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        setSaveMessage(`✅ Saved ${result.count} records to database`);
        setPreview([]);
        setFile(null);
      } else {
        setSaveMessage(`❌ Save failed: ${result.error}`);
      }
    } catch {
      setSaveMessage("❌ An unexpected error occurred while saving.");
    }

    setSaving(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Import Expense File</h2>

      <input
        type="file"
        accept=".csv, .xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded w-full"
      />

      {file && <p className="text-sm text-gray-500">📄 Selected: {file.name}</p>}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="text-sm">{message}</p>}

      {preview.length > 0 && (
        <>
          <div className="mt-4">
            <h3 className="font-medium mb-2">Imported Preview:</h3>
            <div className="max-h-64 overflow-y-auto border rounded p-2 text-sm space-y-1">
              {preview.map((item, i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <span>{item.date}</span>
                  <span>{item.name}</span>
                  <span>₹{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
            onClick={handleSaveToDB}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save to Database"}
          </button>

          {saveMessage && <p className="text-sm">{saveMessage}</p>}
        </>
      )}
    </div>
  );
}
