import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-8 lg:px-10">
      <Link to="/" className="header-text text-[1.75rem] tracking-[0.16em] text-[#1f2937]">
        PassageLab
      </Link>
      <div className="flex items-center gap-4">
        <a href="#recent" className="text-sm text-[#6B7280] transition hover:text-[#222222]">
          Open library
        </a>
        {/* Admin and Manage links intentionally hidden from the UI. Access via direct URL: /manage or /admin-panel */}
      </div>
    </header>
  )
}
