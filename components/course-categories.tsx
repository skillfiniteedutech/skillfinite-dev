'use client'

import { Badge } from '@/components/ui/badge'

export function CourseCategories({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string
  onCategoryChange: (v: string) => void
}) {
  const categories = ['All', 'AI', 'Web Dev', 'Data', 'Design', 'Mobile']

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-2 w-max">
        {categories.map((c) => (
          <button key={c} onClick={() => onCategoryChange(c)}>
            <Badge
              variant={selectedCategory === c ? 'default' : 'outline'}
              className="text-xs px-2 py-1 whitespace-nowrap"
            >
              {c}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  )
}
