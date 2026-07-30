export default function ReadingPage({
  currentPassage,
  activeCollection,
  fontSize,
  fontFamily,
  theme,
  focusMode,
  selectionMenu,
  dictionary,
  highlights,
  expandedSections,
  onBack,
  onSelection,
  onSelectionLeave,
  onDecreaseFont,
  onIncreaseFont,
  onSetFontFamily,
  onSetTheme,
  onToggleFocusMode,
  onHighlight,
  onCopy,
  onDictionary,
  onCloseDictionary,
  onToggleSection,
  onOpenRelated,
}) {
  const themeClasses = {
    paper: 'bg-[#fcfaf7] text-[#222222]',
    light: 'bg-white text-[#222222]',
    dark: 'bg-[#1f2321] text-[#f3efe8]',
  }

  const textClasses = {
    serif: 'font-serif',
    sans: 'font-sans',
  }

  const analysis = currentPassage.analysis || {}

  const renderSentence = (sentence, index) => {
    const trimmed = sentence.trim()
    const highlight = highlights.find((item) => item.text === trimmed)

    return (
      <p
        key={`${trimmed}-${index}`}
        className="mb-4 text-[17px] leading-8 text-[#2f2f2f]"
        style={{ fontSize: `${fontSize}px` }}
      >
        {highlight ? (
          <span className="rounded-[2px] px-0.5" style={{ backgroundColor: highlight.color }}>
            {trimmed}
          </span>
        ) : (
          trimmed
        )}
      </p>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses[theme]} text-[#222222]`}>
      <header data-aos="fade-down" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:px-8 lg:px-10">
        <a href="#" className="header-text text-[1.6rem] tracking-[0.18em] text-[#1f2937]">
          PassageLab
        </a>
        <div className="flex items-center gap-4 text-sm text-[#6B7280]">
          <button type="button" onClick={onBack} className="transition hover:text-[#222222]">
            ← Back to {activeCollection}
          </button>
          <a href="#" className="transition hover:text-[#222222]">
            Search
          </a>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col px-6 pb-16 md:px-8 lg:px-10">
        {!focusMode && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#d9d2c6] bg-white/80 px-4 py-3 shadow-[0_1px_0_rgba(34,34,34,0.03)]">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <span className="rounded-full border border-[#d9d2c6] px-2 py-1">Aa</span>
              <button type="button" onClick={onDecreaseFont} className="px-2 py-1 transition hover:text-[#24332b]">
                −
              </button>
              <button type="button" onClick={onIncreaseFont} className="px-2 py-1 transition hover:text-[#24332b]">
                +
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <button
                type="button"
                onClick={() => onSetFontFamily('serif')}
                className={`rounded-full border px-3 py-1 transition ${
                  fontFamily === 'serif'
                    ? 'border-[#24332b] bg-[#24332b] text-white'
                    : 'border-[#d9d2c6] bg-white hover:border-[#24332b] hover:text-[#24332b]'
                }`}
              >
                Serif
              </button>
              <button
                type="button"
                onClick={() => onSetFontFamily('sans')}
                className={`rounded-full border px-3 py-1 transition ${
                  fontFamily === 'sans'
                    ? 'border-[#24332b] bg-[#24332b] text-white'
                    : 'border-[#d9d2c6] bg-white hover:border-[#24332b] hover:text-[#24332b]'
                }`}
              >
                Sans
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <button
                type="button"
                onClick={() => onSetTheme('paper')}
                className={`rounded-full border px-3 py-1 transition ${
                  theme === 'paper'
                    ? 'border-[#24332b] bg-[#24332b] text-white'
                    : 'border-[#d9d2c6] bg-white hover:border-[#24332b] hover:text-[#24332b]'
                }`}
              >
                ☀︎ Paper
              </button>
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`rounded-full border px-3 py-1 transition ${
                  theme === 'light'
                    ? 'border-[#24332b] bg-[#24332b] text-white'
                    : 'border-[#d9d2c6] bg-white hover:border-[#24332b] hover:text-[#24332b]'
                }`}
              >
                ☀︎ Light
              </button>
              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`rounded-full border px-3 py-1 transition ${
                  theme === 'dark'
                    ? 'border-[#24332b] bg-[#24332b] text-white'
                    : 'border-[#d9d2c6] bg-white hover:border-[#24332b] hover:text-[#24332b]'
                }`}
              >
                ☾ Dark
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleFocusMode}
              className="rounded-full border border-[#d9d2c6] bg-white px-3 py-1 text-sm text-[#6B7280] transition hover:border-[#24332b] hover:text-[#24332b]"
            >
              ⤢ Focus Mode
            </button>
          </div>
        )}

        {focusMode && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={() => onToggleFocusMode()}
              className="rounded-full border border-[#d9d2c6] bg-white px-3 py-1 text-sm text-[#6B7280] transition hover:border-[#24332b] hover:text-[#24332b]"
            >
              Exit focus mode
            </button>
          </div>
        )}

        <article data-aos="fade-up" className={`mx-auto w-full rounded-[20px] border border-[#d9d2c6] bg-white/90 px-6 py-8 shadow-[0_1px_0_rgba(34,34,34,0.03)] sm:px-8 lg:px-10 ${focusMode ? 'max-w-[760px]' : 'max-w-[740px]'}`}>
          <div className="mb-8 border-b border-[#e7e0d6] pb-6">
            <h1 className={`header-text text-3xl text-[#1f2937] sm:text-4xl ${textClasses[fontFamily]}`}>{currentPassage.title}</h1>
            <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[#6B7280]">
              {currentPassage.category} • {currentPassage.difficulty} • {currentPassage.time}
            </p>
          </div>

          <div
            className={`select-text ${textClasses[fontFamily]}`}
            onMouseUp={onSelection}
            onMouseLeave={onSelectionLeave}
          >
            {currentPassage.body.map((paragraph, index) => (
              <div key={`${paragraph.slice(0, 10)}-${index}`} className="mb-4">
                {paragraph.split(/(?<=[.!?])\s+/).map((sentence, sentenceIndex) => renderSentence(sentence, sentenceIndex))}
              </div>
            ))}
          </div>
        </article>

        {selectionMenu && (
          <div
            className="fixed z-20 flex min-w-[180px] flex-col rounded-[12px] border border-[#d9d2c6] bg-[#fcfaf7] p-2 shadow-[0_4px_12px_rgba(34,34,34,0.08)]"
            style={{ top: `${selectionMenu.y}px`, left: `${selectionMenu.x}px`, transform: 'translate(-50%, -100%)' }}
          >
            <button type="button" onClick={() => onHighlight('#f7e58a')} className="rounded-[8px] px-3 py-2 text-left text-sm text-[#222222] transition hover:bg-white">
              Highlight
            </button>
            <button type="button" onClick={onCopy} className="rounded-[8px] px-3 py-2 text-left text-sm text-[#222222] transition hover:bg-white">
              Copy
            </button>
            <button type="button" onClick={onDictionary} className="rounded-[8px] px-3 py-2 text-left text-sm text-[#222222] transition hover:bg-white">
              Dictionary
            </button>
          </div>
        )}

        {dictionary && (
          <div className="mx-auto mt-6 w-full max-w-[740px] rounded-[12px] border border-[#d9d2c6] bg-white p-5 shadow-[0_1px_0_rgba(34,34,34,0.03)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">Dictionary</p>
                <h2 className="header-text text-[1.1rem] text-[#1f2937]">{dictionary.word}</h2>
              </div>
              <button type="button" onClick={onCloseDictionary} className="text-sm text-[#6B7280] transition hover:text-[#222222]">
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-[#4b5563] sm:grid-cols-2">
              <div>
                <p className="text-[#6B7280]">Pronunciation</p>
                <p className="mt-1">{dictionary.pronunciation}</p>
              </div>
              <div>
                <p className="text-[#6B7280]">Part of speech</p>
                <p className="mt-1">{dictionary.partOfSpeech}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[#6B7280]">Definition</p>
              <p className="mt-1">{dictionary.definition}</p>
            </div>
            <div className="mt-4">
              <p className="text-[#6B7280]">Example sentence</p>
              <p className="mt-1">{dictionary.example}</p>
            </div>
            <div className="mt-4">
              <p className="text-[#6B7280]">Synonyms</p>
              <p className="mt-1">{dictionary.synonyms?.join(', ') || '—'}</p>
            </div>
          </div>
        )}

        <section data-aos="fade-up" className="mx-auto mt-10 w-full max-w-[740px] rounded-[20px] border border-[#d9d2c6] bg-[#fcfaf7] p-6 shadow-[0_1px_0_rgba(34,34,34,0.04)] sm:p-8">
          <div className="space-y-3">
            {[
              analysis.mainIdea && {
                key: 'mainIdea',
                title: 'Main Idea',
                body: <p className="text-[15px] leading-7 text-[#4b5563]">{analysis.mainIdea}</p>,
              },
              analysis.mainPurpose && {
                key: 'mainPurpose',
                title: 'Main Purpose',
                body: <p className="text-[15px] leading-7 text-[#4b5563]">{analysis.mainPurpose}</p>,
              },
              analysis.structure && {
                key: 'structure',
                title: 'Structure',
                body: <ol className="space-y-2 text-[15px] leading-7 text-[#4b5563]">{analysis.structure.map((item) => <li key={item}>{item}</li>)}</ol>,
              },
              analysis.vocabulary?.length > 0 && {
                key: 'vocabulary',
                title: 'Vocabulary',
                body: (
                  <div className="grid gap-3">
                    {analysis.vocabulary.map((item) => (
                      <div key={item.word} className="rounded-[12px] border border-[#d9d2c6] bg-white p-4">
                        <p className="header-text text-[16px] text-[#222222]">{item.word}</p>
                        <p className="mt-1 text-sm text-[#6B7280]">{item.definition}</p>
                        <p className="mt-2 text-sm text-[#4b5563]">{item.example}</p>
                        <p className="mt-2 text-sm text-[#6B7280]">{item.partOfSpeech} • {item.pronunciation}</p>
                        <p className="mt-2 text-sm text-[#6B7280]">Synonyms: {item.synonyms?.join(', ') || '—'}</p>
                      </div>
                    ))}
                  </div>
                ),
              },
              analysis.tone && {
                key: 'tone',
                title: 'Tone',
                body: <p className="text-[15px] leading-7 text-[#4b5563]">{analysis.tone}</p>,
              },
              analysis.inference && {
                key: 'inference',
                title: 'Inference',
                body: <p className="text-[15px] leading-7 text-[#4b5563]">{analysis.inference}</p>,
              },
            ]
              .filter(Boolean)
              .map((section) => (
                <div key={section.key} className="rounded-[12px] border border-[#d9d2c6] bg-white p-4">
                  <button type="button" onClick={() => onToggleSection(section.key)} className="flex w-full items-center justify-between text-left">
                    <span className="header-text text-[16px] text-[#1f2937]">{section.title}</span>
                    <span className="text-[#6B7280]">{expandedSections[section.key] ? '▲' : '▼'}</span>
                  </button>
                  {expandedSections[section.key] && <div className="mt-3">{section.body}</div>}
                </div>
              ))}
          </div>
        </section>

        <section className="mx-auto mt-10 w-full max-w-[740px]">
          <h2 className="header-text text-2xl text-[#1f2937]">More from {activeCollection}</h2>
          <div className="mt-4 space-y-3">
            {currentPassage.related?.length > 0 ? (
              currentPassage.related.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => onOpenRelated?.(item)}
                  className="flex w-full items-center justify-between rounded-[12px] border border-[#d9d2c6] bg-white px-5 py-4 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#24332b]"
                >
                  <div>
                    <p className="text-[16px] text-[#222222]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{item.difficulty} • {item.time}</p>
                  </div>
                  <span className="text-[#24332b]">→</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-[#6B7280]">More passages will appear here soon.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d9d2c6] bg-[#f4efe8] px-6 py-8 text-sm text-[#6B7280] md:px-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PassageLab. All rights reserved.</p>
          <p>Built by CodeCraft</p>
        </div>
      </footer>
    </div>
  )
}
