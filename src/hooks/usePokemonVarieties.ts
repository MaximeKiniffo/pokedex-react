import { useQueries } from '@tanstack/react-query'
import type { Pokemon, PokemonSpecies, PokemonVariety } from '../types/pokemon'

async function fetchPokemonVariety(url: string): Promise<Pokemon> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch Pokemon variety')
  return res.json()
}

export function usePokemonVarieties(species?: PokemonSpecies) {
  const varieties = species?.varieties ?? []
  const queries = useQueries({
    queries: varieties.map(variety => ({
      queryKey: ['pokemon-variety', variety.pokemon.name],
      queryFn: () => fetchPokemonVariety(variety.pokemon.url),
      staleTime: 1000 * 60 * 60,
      enabled: Boolean(species),
    })),
  })

  return varieties.map((variety: PokemonVariety, index) => ({
    variety,
    query: queries[index],
  }))
}
