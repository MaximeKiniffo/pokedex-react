import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePokemon } from '../hooks/usePokemon'
import { usePokemonSpecies } from '../hooks/usePokemonSpecies'
import { useEvolutionChain } from '../hooks/useEvolutionChain'
import { TypeBadge } from './TypeBadge'
import { PokemonTabs } from './PokemonTabs'
import { getTypeInfo } from '../data/types'

const MAX_POKEMON_ID = 1025

export function PokemonDetail() {
  const { id } = useParams<{ id: string }>()
  const index = parseInt(id ?? '0', 10)
  const parsedId = index + 1
  const isFirstPokemon = parsedId <= 1
  const isLastPokemon = parsedId >= MAX_POKEMON_ID

  const { data: pokemon, isLoading, isError } = usePokemon(parsedId)
  const { data: species, isLoading: isSpeciesLoading } = usePokemonSpecies(parsedId)
  const { data: evolution, isLoading: isEvolutionLoading } = useEvolutionChain(species?.evolution_chain.url)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !pokemon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-500 gap-4">
        <span className="text-6xl">😵</span>
        <p className="text-xl font-semibold">Pokémon introuvable</p>
        <Link to="/" className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors">
          Retour à la liste
        </Link>
      </div>
    )
  }

  const mainType = pokemon.types[0].type.name
  const typeInfo = getTypeInfo(mainType)
  const bgColor = typeInfo?.colour ?? '#a8a878'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors duration-300">
      <div
        className="relative pt-6 pb-28 flex flex-col items-center overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${bgColor}55 0%, ${bgColor}22 65%, transparent 100%)` }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-5 dark:opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 50% 40%, ${bgColor} 0%, transparent 65%)` }}
        />

        <div className="relative w-full max-w-3xl mx-auto px-4 flex justify-between items-center mb-4">
          <Link
            to={isFirstPokemon ? '#' : `/pokemons/${index - 1}`}
            aria-disabled={isFirstPokemon}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-700 dark:text-gray-200 text-sm font-medium shadow-sm transition hover:bg-white dark:hover:bg-gray-700 ${isFirstPokemon ? 'opacity-30 pointer-events-none' : ''}`}
          >
            ← Précédent
          </Link>
          <span className="font-lexend font-bold text-gray-500 dark:text-gray-400">
            #{String(parsedId).padStart(3, '0')}
          </span>
          <Link
            to={isLastPokemon ? '#' : `/pokemons/${index + 1}`}
            aria-disabled={isLastPokemon}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-700 dark:text-gray-200 text-sm font-medium shadow-sm transition hover:bg-white dark:hover:bg-gray-700 ${isLastPokemon ? 'opacity-30 pointer-events-none' : ''}`}
          >
            Suivant →
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-lexend font-bold text-4xl md:text-5xl uppercase tracking-widest text-gray-800 dark:text-white"
        >
          {pokemon.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mt-3"
        >
          {pokemon.types.map(t => (
            <TypeBadge key={t.type.name} typeName={t.type.name} size="lg" />
          ))}
        </motion.div>

        <motion.img
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.05 }}
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          className="w-52 h-52 md:w-64 md:h-64 object-contain drop-shadow-2xl mt-6"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 -mt-16 pb-16">
        <PokemonTabs
          pokemon={pokemon}
          species={species}
          evolution={evolution}
          isSpeciesLoading={isSpeciesLoading}
          isEvolutionLoading={isEvolutionLoading}
          bgColor={bgColor}
        />
      </div>
    </div>
  )
}
