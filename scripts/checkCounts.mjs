import { collections } from '../src/data/content.js'

collections.forEach((c) => {
  const actual = c.passages ? c.passages.length : 0
  console.log(`${c.name} | declared=${c.count} | actual=${actual}`)
})
