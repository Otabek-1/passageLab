import Navbar from '../Components/Navbar'

export default function HomePage({ collections, recentPassages, onSelectCollection, scrollToRecent, onChooseRandom = () => {}, onOpenPassage = () => {} }) {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#222222]">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col px-6 pb-16 pt-8 md:px-8 lg:px-10">
        <section data-aos="fade-up" className="rounded-[20px] border border-[#d9d2c6] bg-[#fcfaf7] px-8 py-10 shadow-[0_1px_0_rgba(34,34,34,0.04)] sm:px-10 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#6B7280]">PassageLab</p>
              <h1 className="header-text text-4xl leading-tight text-[#1f2937] sm:text-5xl">
                Enhance your reading comprehension through carefully curated SAT-style passages.
              </h1>
              <p className="mt-6 max-w-xl text-[15px] leading-8 text-[#4b5563]">
                PassageLab brings a calm, academic reading experience to every session. Discover subjects, practice readings, and build confidence with quiet focus.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToRecent}
              className="inline-flex items-center justify-center rounded-[12px] border border-[#24332b] bg-[#24332b] px-5 py-3 text-sm font-medium text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#1b2722]"
            >
              Start reading
            </button>
          </div>

          <div className="mt-8 flex items-center rounded-[12px] border border-[#d9d2c6] bg-white px-4 py-3 shadow-[0_1px_0_rgba(34,34,34,0.03)]">
            <span className="mr-3 text-lg text-[#6B7280]">⌕</span>
            <input
              type="text"
              placeholder="Search passages..."
              className="w-full border-0 bg-transparent text-[15px] outline-none placeholder:text-[#6B7280]"
            />
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="header-text text-2xl text-[#1f2937]">Collections</h2>
            <div className="flex items-center gap-4">
              <p className="text-sm text-[#6B7280]">Curated by subject</p>
              <button
                type="button"
                onClick={onChooseRandom}
                className="rounded-full border border-[#24332b] bg-white px-3 py-2 text-sm text-[#24332b] hover:bg-[#f4f4f2]"
              >
                Choose Random
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((item) => {
              const passageCount = item.passages?.length || 0

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onSelectCollection(item.name)}
                  className="group rounded-[12px] border border-[#d9d2c6] bg-[#fcfaf7] px-5 py-4 text-left shadow-[0_1px_0_rgba(34,34,34,0.03)] transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#24332b] hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[15px] text-[#222222] transition group-hover:text-[#24332b]">{item.name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full border border-[#d9d2c6] bg-white px-2.5 py-1 text-xs font-medium text-[#6B7280] transition group-hover:border-[#24332b] group-hover:text-[#24332b]">
                        {passageCount} contexts
                      </span>
                      <span className="text-[#6B7280] transition group-hover:translate-x-0.5 group-hover:text-[#24332b]">→</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section id="recent" className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="header-text text-2xl text-[#1f2937]">Recent Passages</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Freshly chosen for calm, focused reading</p>
            </div>
            <a href="#recent" className="text-sm text-[#24332b] underline-offset-4 hover:underline">
              Browse all
            </a>
          </div>

          <div className="mt-6 space-y-3">
            {recentPassages.map((passage) => (
              <button
                key={passage.title}
                type="button"
                onClick={() => onOpenPassage(passage, passage.collection || passage.meta?.split(' • ')[0] || '')}
                className="flex w-full items-center justify-between rounded-[12px] border border-[#d9d2c6] bg-white px-5 py-4 shadow-[0_1px_0_rgba(34,34,34,0.03)]"
              >
                <div>
                  <h3 className="text-[17px] text-[#222222]">{passage.title}</h3>
                  <p className="mt-1 text-sm text-[#6B7280]">{passage.meta}</p>
                </div>
                <span className="text-[#24332b]">→</span>
              </button>
            ))}
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
