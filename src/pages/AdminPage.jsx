import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'

function emptyPassage() {
  return {
    title: 'New Passage',
    description: '',
    difficulty: 'Easy',
    time: '2 min',
    category: '',
    body: [''],
    analysis: { mainIdea: '', mainPurpose: '', structure: [], vocabulary: [], tone: '', inference: '' },
    related: [],
  }
}

export default function AdminPage({ bank, onSave }) {
  const [collections, setCollections] = useState(bank.collections || [])
  const [recent, setRecent] = useState(bank.recentPassages || [])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [editingPassageIdx, setEditingPassageIdx] = useState(null)
  const [collectionName, setCollectionName] = useState('')

  useEffect(() => {
    setCollections(bank.collections || [])
    setRecent(bank.recentPassages || [])
  }, [bank])

  useEffect(() => {
    if (collections[selectedIdx]) setCollectionName(collections[selectedIdx].name)
  }, [collections, selectedIdx])

  const selectCollection = (i) => {
    setSelectedIdx(i)
    setEditingPassageIdx(null)
  }

  const addCollection = () => {
    const name = prompt('Collection name')
    if (!name) return
    setCollections((prev) => [...prev, { name, count: '0 passages', description: '', passages: [] }])
    setSelectedIdx(collections.length)
  }

  const deleteCollection = (i) => {
    if (!confirm('Delete this collection?')) return
    const next = [...collections]
    next.splice(i, 1)
    setCollections(next)
    setSelectedIdx(Math.max(0, i - 1))
  }

  const renameCollection = () => {
    const next = [...collections]
    next[selectedIdx] = { ...next[selectedIdx], name: collectionName }
    setCollections(next)
  }

  const addPassage = () => {
    const next = [...collections]
    const p = emptyPassage()
    p.category = next[selectedIdx]?.name || ''
    next[selectedIdx].passages = [...(next[selectedIdx].passages || []), p]
    setCollections(next)
    setEditingPassageIdx(next[selectedIdx].passages.length - 1)
  }

  const deletePassage = (idx) => {
    if (!confirm('Delete this passage?')) return
    const next = [...collections]
    next[selectedIdx].passages.splice(idx, 1)
    setCollections(next)
    setEditingPassageIdx(null)
  }

  const updatePassageField = (idx, field, value) => {
    const next = [...collections]
    next[selectedIdx].passages[idx] = { ...next[selectedIdx].passages[idx], [field]: value }
    setCollections(next)
  }

  const updatePassageBody = (idx, value) => {
    const paragraphs = value.split('\n\n').map((p) => p.trim()).filter(Boolean)
    const next = [...collections]
    next[selectedIdx].passages[idx].body = paragraphs
    setCollections(next)
  }

  const saveBank = () => {
    const payload = { collections, recentPassages: recent }
    localStorage.setItem('passageBank', JSON.stringify(payload))
    if (onSave) onSave()
    alert('Saved bank to localStorage')
  }

  const exportJSON = () => {
    const data = JSON.stringify({ collections, recentPassages: recent }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'passageBank-admin.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#222222]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8 md:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <h1 className="header-text text-2xl">Admin Panel</h1>
          <div className="flex gap-2">
            <button onClick={addCollection} className="rounded border px-3 py-2">Add Collection</button>
            <button onClick={saveBank} className="rounded border px-3 py-2">Save</button>
            <button onClick={exportJSON} className="rounded border px-3 py-2">Export</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium">Collections</h3>
            <ul className="mt-3 space-y-2">
              {collections.map((c, i) => (
                <li key={c.name} className={`flex items-center justify-between rounded border p-2 ${i === selectedIdx ? 'bg-white' : 'bg-[#fcfaf7]'}`}>
                  <button onClick={() => selectCollection(i)} className="text-left">{c.name}</button>
                  <div className="flex gap-1">
                    <button onClick={() => { setSelectedIdx(i); setCollectionName(c.name); if (confirm('Rename this collection?')) { const nm = prompt('New name', c.name); if (nm) { setCollectionName(nm); const next = [...collections]; next[i].name = nm; setCollections(next); } } }} className="px-2">✎</button>
                    <button onClick={() => deleteCollection(i)} className="px-2">🗑</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <h3 className="font-medium">Collection: {collections[selectedIdx]?.name}</h3>
            <div className="mt-2 flex gap-2">
              <input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="rounded border px-2 py-1" />
              <button onClick={renameCollection} className="rounded border px-3 py-1">Rename</button>
              <button onClick={addPassage} className="rounded border px-3 py-1">Add Passage</button>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Passages</h4>
              <ul className="mt-2 space-y-2">
                {collections[selectedIdx]?.passages?.map((p, idx) => (
                  <li key={p.title + idx} className="rounded border p-3 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-semibold">{p.title}</h5>
                        <p className="text-sm text-[#6B7280]">{p.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingPassageIdx(idx)} className="px-2">Edit</button>
                        <button onClick={() => deletePassage(idx)} className="px-2">Delete</button>
                      </div>
                    </div>

                    {editingPassageIdx === idx && (
                      <div className="mt-3 grid gap-2">
                        <input value={p.title} onChange={(e) => updatePassageField(idx, 'title', e.target.value)} className="rounded border px-2 py-1" />
                        <input value={p.description} onChange={(e) => updatePassageField(idx, 'description', e.target.value)} className="rounded border px-2 py-1" />
                        <div className="flex gap-2">
                          <select value={p.difficulty} onChange={(e) => updatePassageField(idx, 'difficulty', e.target.value)} className="rounded border px-2 py-1">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                          <input value={p.time} onChange={(e) => updatePassageField(idx, 'time', e.target.value)} className="rounded border px-2 py-1" />
                        </div>
                        <textarea value={p.body.join('\n\n')} onChange={(e) => updatePassageBody(idx, e.target.value)} className="rounded border p-2 min-h-[120px]" />
                        <div className="flex gap-2">
                          <button onClick={() => setEditingPassageIdx(null)} className="rounded border px-3 py-1">Done</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
