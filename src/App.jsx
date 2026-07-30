import React, { useState, useEffect } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import ReadingPage from './pages/ReadingPage'
import { collections as defaultCollections, recentPassages as defaultRecent } from './data/content'
import ManagePage from './pages/ManagePage'
import AdminPage from './pages/AdminPage'
import AdminGate from './pages/AdminGate'

const filters = ['All', 'Easy', 'Medium', 'Hard', 'Newest', 'Alphabetical']

const dictionaryEntries = {
  fungal: {
    word: 'fungal',
    pronunciation: '/ˈfʌŋɡəl/',
    definition: 'Relating to or caused by fungi.',
    partOfSpeech: 'adjective',
    example: 'A fungal network can connect plant roots beneath the soil.',
    synonyms: ['mushroom-related', 'mycological'],
  },
  migration: {
    word: 'migration',
    pronunciation: '/maɪˈɡreɪʃən/',
    definition: 'The movement of animals or people from one place to another, often seasonally.',
    partOfSpeech: 'noun',
    example: 'Bird migration is one of nature’s great phenomena.',
    synonyms: ['travel', 'movement', 'journey'],
  },
  climate: {
    word: 'climate',
    pronunciation: '/ˈklaɪmət/',
    definition: 'The long-term pattern of weather in a region.',
    partOfSpeech: 'noun',
    example: 'The climate of the region has grown warmer over time.',
    synonyms: ['weather pattern', 'environment'],
  },
  interdependence: {
    word: 'interdependence',
    pronunciation: '/ˌɪntərdɪˈpɛndəns/',
    definition: 'The condition of depending on one another.',
    partOfSpeech: 'noun',
    example: 'The forest demonstrates interdependence between species.',
    synonyms: ['mutual reliance', 'dependence'],
  },
}

export default function App() {
  const [activeCollection, setActiveCollection] = useState(null)
  const normalizeCollections = (collections) =>
    (collections || []).map((c) => ({
      ...c,
      count: c.name === 'SAT Prep' ? `${(c.passages?.length || 0)} practice passages` : `${(c.passages?.length || 0)} curated passages`,
    }))

  const mergeCollections = (existing = [], defaults = []) =>
    (defaults || []).map((def) => {
      const ex = (existing || []).find((e) => e.name === def.name)
      const exPassages = ex?.passages || []
      const exTitles = new Set(exPassages.map((p) => p.title))
      const mergedPassages = [...exPassages]
      ;(def.passages || []).forEach((p) => {
        if (!exTitles.has(p.title)) mergedPassages.push(p)
      })
      return { ...def, passages: mergedPassages }
    })

  const [activeFilter, setActiveFilter] = useState('All')
  const [activePassage, setActivePassage] = useState(null)
  const [fontSize, setFontSize] = useState(18)
  const [fontFamily, setFontFamily] = useState('serif')
  const [theme, setTheme] = useState('paper')
  const [focusMode, setFocusMode] = useState(false)
  const [selectionMenu, setSelectionMenu] = useState(null)
  const [dictionary, setDictionary] = useState(null)
  const [highlights, setHighlights] = useState([])
  const [expandedSections, setExpandedSections] = useState({})

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
      offset: 120,
    })
  }, [])

  const [bank, setBank] = useState(() => {
    try {
      const raw = localStorage.getItem('passageBank')
      if (!raw) return { collections: normalizeCollections(defaultCollections), recentPassages: defaultRecent }
      const parsed = JSON.parse(raw)
      const merged = mergeCollections(parsed.collections || defaultCollections, defaultCollections)
      return {
        collections: normalizeCollections(merged),
        recentPassages: parsed.recentPassages || defaultRecent,
      }
    } catch (e) {
      return { collections: defaultCollections, recentPassages: defaultRecent }
    }
  })

  const saveDefaultBank = () => {
    // force re-read from localStorage
    try {
      const raw = localStorage.getItem('passageBank')
      if (!raw) return setBank({ collections: normalizeCollections(defaultCollections), recentPassages: defaultRecent })
      const parsed = JSON.parse(raw)
      const merged = mergeCollections(parsed.collections || defaultCollections, defaultCollections)
      setBank({ collections: normalizeCollections(merged), recentPassages: parsed.recentPassages || defaultRecent })
    } catch (e) {
      setBank({ collections: normalizeCollections(defaultCollections), recentPassages: defaultRecent })
    }
  }

  const persistBank = (nextBank) => {
    try {
      const normalized = { ...nextBank, collections: normalizeCollections(nextBank.collections) }
      localStorage.setItem('passageBank', JSON.stringify(normalized))
      setBank(normalized)
    } catch (e) {
      // ignore write errors
      setBank(nextBank)
    }
  }

    const pushRecent = (passage, collectionName) => {
      try {
        const entry = {
          ...passage,
          collectionName,
          meta: `${collectionName} • ${passage.difficulty} • ${passage.time}`,
        }
        const nextRecent = [entry, ...(bank.recentPassages || [])].slice(0, 20)
        const next = { ...bank, recentPassages: nextRecent }
        persistBank(next)
      } catch (e) { }
    }

    const selectedCollection = bank.collections.find((item) => item.name === activeCollection)
    const currentPassage = activePassage || null

    const visiblePassages = (() => {
      if (!selectedCollection) return []

      const list = [...selectedCollection.passages]

      if (activeFilter === 'Alphabetical') {
        list.sort((a, b) => a.title.localeCompare(b.title))
      }

      if (activeFilter === 'Easy' || activeFilter === 'Medium' || activeFilter === 'Hard') {
        return list.filter((item) => item.difficulty === activeFilter)
      }

      return list
    })()

    const scrollToRecent = () => {
      document.getElementById('recent')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    const handleSelection = () => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()

      if (!text) {
        setSelectionMenu(null)
        return
      }

      const range = selection?.getRangeAt(0)
      if (!range) return

      const rect = range.getBoundingClientRect()
      setSelectionMenu({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 72,
      })
    }

    const handleHighlight = (color) => {
      if (!selectionMenu?.text) return

      setHighlights((previous) => {
        const next = [...previous]
        const existingIndex = next.findIndex((item) => item.text === selectionMenu.text)
        if (existingIndex >= 0) {
          next[existingIndex] = { ...next[existingIndex], color }
        } else {
          next.push({ text: selectionMenu.text, color })
        }
        return next
      })
      setSelectionMenu(null)
    }

    const handleCopy = async () => {
      if (!selectionMenu?.text) return
      await navigator.clipboard.writeText(selectionMenu.text)
      setSelectionMenu(null)
    }

    const handleDictionary = () => {
      const key = selectionMenu?.text.toLowerCase().replace(/[^a-z]/g, '')
      const entry = dictionaryEntries[key]

      if (!entry) {
        setDictionary({
          word: selectionMenu?.text,
          pronunciation: '—',
          definition: 'A short definition will appear here.',
          partOfSpeech: 'noun',
          example: 'This text can be looked up in a fuller dictionary view.',
          synonyms: ['—'],
        })
      } else {
        setDictionary(entry)
      }

      setSelectionMenu(null)
    }

    const handleToggleSection = (key) => {
      setExpandedSections((previous) => ({ ...previous, [key]: !previous[key] }))
    }

    const navigate = useNavigate()

    function HomeRoute() {
      return (
        <HomePage
          collections={bank.collections}
          recentPassages={bank.recentPassages}
          onSelectCollection={(name) => navigate(`/collection/${encodeURIComponent(name)}`)}
          onChooseRandom={() => {
            // choose a random passage from all collections
            const all = bank.collections.flatMap((c) => c.passages.map((p) => ({ passage: p, collection: c.name })))
            if (all.length === 0) return
            const pick = all[Math.floor(Math.random() * all.length)]
            pushRecent(pick.passage, pick.collection)
            navigate(`/reading/${encodeURIComponent(pick.collection)}/${encodeURIComponent(pick.passage.title)}`)
          }}
          onOpenPassage={(passage, collectionName) => {
            pushRecent(passage, collectionName)
            navigate(`/reading/${encodeURIComponent(collectionName)}/${encodeURIComponent(passage.title)}`)
          }}
          scrollToRecent={scrollToRecent}
        />
      )
    }

    function CollectionRoute() {
      const { name } = useParams()

      useEffect(() => {
        if (name) setActiveCollection(decodeURIComponent(name))
      }, [name])

      const selected = bank.collections.find((item) => item.name === decodeURIComponent(name))
      const list = selected ? [...selected.passages] : []

      const visible = (() => {
        if (!selected) return []

        if (activeFilter === 'Alphabetical') {
          list.sort((a, b) => a.title.localeCompare(b.title))
        }

        if (activeFilter === 'Easy' || activeFilter === 'Medium' || activeFilter === 'Hard') {
          return list.filter((item) => item.difficulty === activeFilter)
        }

        return list
      })()

      return (
        <CollectionPage
          collection={selected}
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onBack={() => navigate('/')}
          onSelectPassage={(passage) => {
            pushRecent(passage, selected.name)
            navigate(`/reading/${encodeURIComponent(selected.name)}/${encodeURIComponent(passage.title)}`)
          }}
          onChooseRandomFromCollection={() => {
            if (!selected || !selected.passages || selected.passages.length === 0) return
            const pick = selected.passages[Math.floor(Math.random() * selected.passages.length)]
            pushRecent(pick, selected.name)
            navigate(`/reading/${encodeURIComponent(selected.name)}/${encodeURIComponent(pick.title)}`)
          }}
          passages={visible}
        />
      )
    }

    function ReadingRoute() {
      const { collection: collParam, title } = useParams()

      useEffect(() => {
        if (collParam) setActiveCollection(decodeURIComponent(collParam))
      }, [collParam])

      const sel = bank.collections.find((c) => c.name === decodeURIComponent(collParam))
      const passage = sel ? sel.passages.find((p) => p.title === decodeURIComponent(title)) : null

      if (!passage) return <div className="p-8">Passage not found.</div>

      return (
        <ReadingPage
          currentPassage={passage}
          activeCollection={sel?.name}
          fontSize={fontSize}
          fontFamily={fontFamily}
          theme={theme}
          focusMode={focusMode}
          selectionMenu={selectionMenu}
          dictionary={dictionary}
          highlights={highlights}
          expandedSections={expandedSections}
          onBack={() => navigate(`/collection/${encodeURIComponent(sel.name)}`)}
          onSelection={handleSelection}
          onSelectionLeave={() => setSelectionMenu(null)}
          onDecreaseFont={() => setFontSize((value) => Math.max(15, value - 1))}
          onIncreaseFont={() => setFontSize((value) => Math.min(22, value + 1))}
          onSetFontFamily={setFontFamily}
          onSetTheme={setTheme}
          onToggleFocusMode={() => setFocusMode((value) => !value)}
          onHighlight={handleHighlight}
          onCopy={handleCopy}
          onDictionary={handleDictionary}
          onCloseDictionary={() => setDictionary(null)}
          onToggleSection={handleToggleSection}
          onOpenRelated={(relatedPassage) => {
            if (!sel) return
            pushRecent(relatedPassage, sel.name)
            navigate(`/reading/${encodeURIComponent(sel.name)}/${encodeURIComponent(relatedPassage.title)}`)
          }}
        />
      )
    }

    return (
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/collection/:name" element={<CollectionRoute />} />
        <Route path="/reading/:collection/:title" element={<ReadingRoute />} />
        <Route
          path="/manage"
          element={
            <AdminGate bank={bank} onSave={saveDefaultBank}>
              <ManagePage defaultBank={{ collections: defaultCollections, recentPassages: defaultRecent }} onSaveDefault={saveDefaultBank} />
            </AdminGate>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminGate bank={bank} onSave={saveDefaultBank}>
              <AdminPage bank={bank} onSave={saveDefaultBank} />
            </AdminGate>
          }
        />
        <Route path="/admin-panel" element={<AdminGate bank={bank} onSave={saveDefaultBank} />} />
        <Route path="*" element={<HomeRoute />} />
      </Routes>
    )
  }