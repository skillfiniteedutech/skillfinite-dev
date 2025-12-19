'use client'

export function CourseFilters({
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
    <div className="mt-4 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Category</label>
        <select
          className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Level</label>
        <select
          className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedLevel}
          onChange={(e) => onLevelChange(e.target.value)}
        >
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
