import React, { useState } from 'react'
import Navbar from '../Components/Navbar'

export default function ManagePage({ defaultBank, onSaveDefault }) {
  const [text, setText] = useState(JSON.stringify(defaultBank, null, 2))
  const [message, setMessage] = useState('')

  const saveToLocal = () => {
    try {
      const parsed = JSON.parse(text)
      localStorage.setItem('passageBank', JSON.stringify(parsed))
      setMessage('Saved to localStorage.')
    } catch (e) {
      setMessage('Invalid JSON — fix errors before saving.')
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const downloadJSON = () => {
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'passageBank.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const loadFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const content = await file.text()
    setText(content)
  }

  const resetDefault = () => {
    localStorage.removeItem('passageBank')
    onSaveDefault()
    setText(JSON.stringify(defaultBank, null, 2))
    setMessage('Reset to default bank.')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#222222]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8 md:px-8 lg:px-10">
        <h1 className="header-text text-2xl">Manage Passage Bank</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Edit the passage bank JSON directly, then save to localStorage or download.</p>

        <div className="mt-4 flex gap-2">
          <button onClick={saveToLocal} className="rounded border px-3 py-2">Save to localStorage</button>
          <button onClick={downloadJSON} className="rounded border px-3 py-2">Download JSON</button>
          <input type="file" accept="application/json" onChange={loadFile} className="ml-2" />
          <button onClick={resetDefault} className="rounded border px-3 py-2">Reset to default</button>
        </div>

        {message && <p className="mt-3 text-sm text-[#24332b]">{message}</p>}

        <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-4 w-full min-h-[400px] rounded border p-3 font-mono text-sm" />
      </main>
    </div>
  )
}
