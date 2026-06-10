import { useQuery } from '@tanstack/react-query'
import type { MoveDetail } from '../types/pokemon'

async function fetchMove(name: string): Promise<MoveDetail> {
  const res = await fetch(`https://pokeapi.co/api/v2/move/${name}`)
  if (!res.ok) throw new Error(`Failed to fetch move ${name}`)
  return res.json()
}

export function useMove(name?: string) {
  return useQuery({
    queryKey: ['move', name],
    queryFn: () => fetchMove(name!),
    staleTime: 1000 * 60 * 60,
    enabled: Boolean(name),
  })
}
