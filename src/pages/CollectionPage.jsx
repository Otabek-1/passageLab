import Navbar from '../Components/Navbar'

export default function CollectionPage({
  collection,
  filters,
  activeFilter,
  onFilterChange,
  onBack,
  onSelectPassage,
  onChooseRandomFromCollection = () => {},
  passages,
}) {
  if (!collection) return null

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#222222]">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col px-6 pb-16 pt-8 md:px-8 lg:px-10">
        <section data-aos="fade-up" className="rounded-[20px] border border-[#d9d2c6] bg-[#fcfaf7] px-8 py-8 shadow-[0_1px_0_rgba(34,34,34,0.04)] sm:px-10 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm uppercase tracking-[0.24em] text-[#6B7280]">Collections</p>
              <h1 className="header-text text-3xl text-[#1f2937] sm:text-4xl">{collection.name}</h1>
              <p className="mt-3 text-sm text-[#6B7280]">{collection.count}</p>
              <p className="mt-4 text-[15px] leading-7 text-[#4b5563]">{collection.description}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="rounded-[12px] border border-[#24332b] bg-[#24332b] px-5 py-3 text-sm font-medium text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#1b2722]"
              >
                ← Back to Collections
              </button>
              <button
                type="button"
                onClick={onChooseRandomFromCollection}
                className="rounded-[12px] border border-[#24332b] bg-white px-4 py-2 text-sm font-medium text-[#24332b] transition duration-200 hover:bg-[#f4f4f2]"
              >
                Choose Random
              </button>
            </div>
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

        <section data-aos="fade-up" className="mt-8 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter

            return (
              <button
                key={filter}
                type="button"
                onClick={() => onFilterChange(filter)}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  isActive
                    ? 'border-[#24332b] bg-[#24332b] text-white'
                    : 'border-[#d9d2c6] bg-white text-[#6B7280] hover:border-[#24332b] hover:text-[#24332b]'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </section>

        <section className="mt-8 space-y-3">
          {passages.map((passage) => (
            <button
              key={passage.title}
              type="button"
              onClick={() => onSelectPassage(passage)}
              className="group flex w-full items-center justify-between rounded-[12px] border border-[#d9d2c6] bg-white px-5 py-4 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:border-[#24332b]"
            >
              <div className="max-w-2xl">
                <h2 className="header-text text-[17px] text-[#222222]">{passage.title}</h2>
                <p className="mt-1 text-sm text-[#6B7280]">{passage.description}</p>
                <p className="mt-2 text-sm text-[#6B7280]">
                  {passage.difficulty} • {passage.time}
                </p>
              </div>
              <span className="text-[#24332b] transition group-hover:translate-x-0.5">→</span>
            </button>
          ))}
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
