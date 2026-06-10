import { useQuery } from '@tanstack/react-query'
import type { TypeData } from '../types/pokemon'

async function fetchTypeData(name: string): Promise<TypeData> {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${name}`)
  if (!res.ok) throw new Error(`Failed to fetch type ${name}`)
  return res.json()
}

export function useTypeData(name?: string) {
  return useQuery({
    queryKey: ['type', name],
    queryFn: () => fetchTypeData(name!),
    staleTime: 1000 * 60 * 60,
    enabled: Boolean(name),
  })
}
