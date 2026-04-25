import React from 'react'
import { getTypeInfo } from '../data/types'

interface Props {
  typeName: string
  size?: 'sm' | 'md' | 'lg'
}

export function TypeBadge({ typeName, size = 'md' }: Props) {
  const info = getTypeInfo(typeName)
  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-5 py-2',
  }[size]

  return (
    <span
      className={`inline-block rounded-full font-semibold capitalize tracking-wide text-white shadow-sm ${sizeClass}`}
      style={{ backgroundColor: info?.colour ?? '#888' }}
    >
      {typeName}
    </span>
  )
}
