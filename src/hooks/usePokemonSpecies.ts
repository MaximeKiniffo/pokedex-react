import { useQuery } from '@tanstack/react-query'
import type { PokemonSpecies } from '../types/pokemon'

async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch Pokemon species #${id}`)
  return res.json()
}

export function usePokemonSpecies(id: number) {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
    staleTime: 1000 * 60 * 60,
    enabled: id > 0,
  })
}
