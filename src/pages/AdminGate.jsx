import React, { useState, useEffect } from 'react'
import AdminPage from './AdminPage'

const PASSWORD = '10010512111111497'
const STORAGE_KEY = 'adminAuthenticated'

export default function AdminGate({ bank, onSave, children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (authed) sessionStorage.setItem(STORAGE_KEY, '1')
  }, [authed])

  const submit = (e) => {
    e.preventDefault()
    if (input === PASSWORD) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setAuthed(false)
    setInput('')
  }

  if (authed) {
    return (
      <div>
        <div className="mx-auto max-w-6xl px-6 py-4 md:px-8 lg:px-10 flex justify-end">
          <button onClick={logout} className="rounded border px-3 py-1">Logout</button>
        </div>
        {/* If a child component is provided, render it; otherwise fall back to AdminPage */}
        {children ? React.cloneElement(children, { bank, onSave }) : <AdminPage bank={bank} onSave={onSave} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#222222] flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm rounded border bg-white p-6">
        <h2 className="text-lg font-semibold">Admin Login</h2>
        <p className="text-sm text-[#6B7280] mt-1">Enter password to access admin panel</p>
        <input type="password" value={input} onChange={(e) => setInput(e.target.value)} className="mt-4 w-full rounded border px-3 py-2" />
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button type="submit" className="rounded border px-3 py-1">Enter</button>
        </div>
      </form>
    </div>
  )
}
