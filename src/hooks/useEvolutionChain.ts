import { useQuery } from '@tanstack/react-query'
import type { EvolutionChain } from '../types/pokemon'

async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch evolution chain')
  return res.json()
}

export function useEvolutionChain(url?: string) {
  return useQuery({
    queryKey: ['evolution-chain', url],
    queryFn: () => fetchEvolutionChain(url!),
    staleTime: 1000 * 60 * 60,
    enabled: Boolean(url),
  })
}
