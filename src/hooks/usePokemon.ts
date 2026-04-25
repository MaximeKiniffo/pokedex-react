import { useQuery } from '@tanstack/react-query'
import type { Pokemon } from '../types/pokemon'

async function fetchPokemon(id: number): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch Pokémon #${id}`)
  return res.json()
}

export function usePokemon(id: number) {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
    staleTime: 1000 * 60 * 60,
    enabled: id > 0,
  })
}
