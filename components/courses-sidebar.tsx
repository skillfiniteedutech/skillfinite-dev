'use client'

export function CoursesSidebar({
  selectedCategory,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
}: {
  selectedCategory: string
  selectedLevel: string
  onCategoryChange: (v: string) => void
  onLevelChange: (v: string) => void
}) {
  const categories = ['All', 'AI', 'Web Dev', 'Data', 'Design', 'Mobile']
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

  return (
    <aside className="rounded-lg border bg-white p-4 sticky top-20">
      <h3 className="font-medium mb-3">Filters</h3>

      <div className="mb-4">
        <label className="block text-xs text-gray-600 mb-1">Category</label>
        <select
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-xs text-gray-600 mb-1">Level</label>
        <select
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedLevel}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
    </aside>
  )
}
