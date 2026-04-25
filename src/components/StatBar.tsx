import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  label: string
  value: number
  max?: number
  color: string
}

export function StatBar({ label, value, max = 255, color }: Props) {
  const pct = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="w-14 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className="w-8 text-sm font-bold text-gray-800 dark:text-white">{value}</span>
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}
