import { useQuery } from '@tanstack/react-query'
import type { PokemonListItem } from '../types/pokemon'

async function fetchPokemonList(): Promise<PokemonListItem[]> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1025')
  if (!res.ok) throw new Error('Failed to fetch Pokémon list')
  const data: { results: PokemonListItem[] } = await res.json()
  return data.results
}

export function usePokemonList() {
  return useQuery({
    queryKey: ['pokemon-list'],
    queryFn: fetchPokemonList,
    staleTime: 1000 * 60 * 60,
  })
}
