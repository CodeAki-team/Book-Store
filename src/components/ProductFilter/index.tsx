'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'


export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategories = searchParams.getAll('category')
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const rating = searchParams.get('rating') || ''

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/products?${params.toString()}`)
  }

  const handleCategoryToggle = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const selected = searchParams.getAll('category')

    if (selected.includes(category)) {
      const updated = selected.filter((c) => c !== category)
      params.delete('category')
      updated.forEach((cat) => params.append('category', cat))
    } else {
      params.append('category', category)
    }

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* دسته‌بندی‌ها */}
      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => (
          <Label key={cat} className="flex items-center gap-2">
            <Checkbox
              checked={currentCategories.includes(cat)}
              onCheckedChange={() => handleCategoryToggle(cat)}
            />
            {cat}
          </Label>
        ))}
      </div>

      {/* فیلتر قیمت و امتیاز */}
      <div className="flex gap-4 flex-wrap">
        <Input
          type="number"
          placeholder="Min Price"
          defaultValue={minPrice}
          onBlur={(e) => updateParams('minPrice', e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max Price"
          defaultValue={maxPrice}
          onBlur={(e) => updateParams('maxPrice', e.target.value)}
        />

        <Select onValueChange={(value) => updateParams('rating', value)} defaultValue={rating}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

