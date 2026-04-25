import React, { useState, useMemo } from 'react'
import { usePokemonList } from '../hooks/usePokemonList'
import { PokemonCard } from './PokemonCard'
import { SkeletonCard } from './SkeletonCard'
import { POKEMON_TYPES } from '../data/types'

const GENERATIONS = [
  { label: 'Gen I',   start: 0,   end: 151  },
  { label: 'Gen II',  start: 151, end: 251  },
  { label: 'Gen III', start: 251, end: 386  },
  { label: 'Gen IV',  start: 386, end: 493  },
  { label: 'Gen V',   start: 493, end: 649  },
  { label: 'Gen VI',  start: 649, end: 721  },
  { label: 'Gen VII', start: 721, end: 809  },
  { label: 'Gen VIII',start: 809, end: 905  },
  { label: 'Gen IX',  start: 905, end: 1025 },
]

const PAGE_SIZE = 60

interface Props {
  search: string
}

export function PokemonGrid({ search }: Props) {
  const { data: pokemonList, isLoading } = usePokemonList()
  const [selectedGen, setSelectedGen] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [typePokemons, setTypePokemons] = useState<string[] | null>(null)
  const [typeLoading, setTypeLoading] = useState(false)

  const handleTypeSelect = async (typeName: string | null) => {
    setSelectedType(typeName)
    setPage(1)
    if (!typeName) {
      setTypePokemons(null)
      return
    }
    setTypeLoading(true)
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
      const data = await res.json()
      const names: string[] = data.pokemon.map((p: { pokemon: { name: string } }) => p.pokemon.name)
      setTypePokemons(names)
    } catch {
      setTypePokemons(null)
    } finally {
      setTypeLoading(false)
    }
  }

  const filtered = useMemo(() => {
    if (!pokemonList) return []
    let list = pokemonList

    if (selectedGen !== null) {
      const gen = GENERATIONS[selectedGen]
      list = list.slice(gen.start, gen.end)
    }
    if (search.trim()) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase().trim()))
    }
    if (typePokemons) {
      const typeSet = new Set(typePokemons)
      list = list.filter(p => typeSet.has(p.name))
    }
    return list
  }, [pokemonList, selectedGen, search, typePokemons])

  const displayed = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = displayed.length < filtered.length

  const idFromUrl = (url: string) => {
    const parts = url.split('/')
    return parseInt(parts[parts.length - 2], 10)
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="sticky top-16 z-40 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => { setSelectedGen(null); setPage(1) }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold font-lexend transition-colors ${
                selectedGen === null
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              Tous
            </button>
            {GENERATIONS.map((gen, i) => (
              <button
                key={gen.label}
                onClick={() => { setSelectedGen(i); setPage(1) }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold font-lexend transition-colors ${
                  selectedGen === i
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {gen.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => handleTypeSelect(null)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                !selectedType
                  ? 'bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-800'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Tous types
            </button>
            {POKEMON_TYPES.map(t => (
              <button
                key={t.type}
                onClick={() => handleTypeSelect(selectedType === t.type ? null : t.type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                  selectedType === t.type ? 'text-white scale-105 shadow-sm' : 'text-white opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.colour }}
              >
                {t.type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading || typeLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
            <span className="text-6xl mb-4">😕</span>
            <p className="text-lg font-medium">Aucun Pokémon trouvé</p>
            {search && <p className="text-sm mt-1">pour « {search} »</p>}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 text-center">
              {filtered.length} Pokémon{filtered.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayed.map(pokemon => {
                const id = idFromUrl(pokemon.url)
                return (
                  <PokemonCard key={pokemon.name} name={pokemon.name} index={id - 1} />
                )
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full font-semibold font-lexend transition-colors shadow-md"
                >
                  Charger plus · {filtered.length - displayed.length} restants
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
