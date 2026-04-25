import React from 'react'

export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse">
      <div className="bg-gray-100 dark:bg-gray-700 flex flex-col items-center pt-4 pb-2">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-600" />
      </div>
      <div className="px-3 py-2.5 flex flex-col items-center gap-2">
        <div className="h-3.5 w-20 bg-gray-200 dark:bg-gray-600 rounded-full" />
        <div className="h-3 w-10 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  )
}
