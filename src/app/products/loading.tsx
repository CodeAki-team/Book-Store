import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="p-4 border rounded-lg shadow-sm">
        <Skeleton className="h-40 w-full mb-4 rounded-md bg-gray-500" />
        <Skeleton className="h-4 w-3/4 mb-2  bg-gray-500" />
        <Skeleton className="h-4 w-1/2 mb-2  bg-gray-500" />
        <Skeleton className="h-8 w-full mt-4 rounded-md  bg-gray-500" />
      </div>
    ))}
  </div>
  )
}

export default loading