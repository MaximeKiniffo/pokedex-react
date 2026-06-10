import { usePokemonVarieties } from '../hooks/usePokemonVarieties'
import type { Pokemon, PokemonSpecies, PokemonVariety } from '../types/pokemon'
import { formatName, getTotalStats } from '../utils/pokemon'
import { StatBar } from './StatBar'
import { TypeBadge } from './TypeBadge'

interface Props {
  species?: PokemonSpecies
  bgColor: string
}

const STAT_CONFIG: Record<string, { label: string; color: string }> = {
  hp: { label: 'HP', color: '#4caf50' },
  attack: { label: 'ATK', color: '#f44336' },
  defense: { label: 'DEF', color: '#2196f3' },
  'special-attack': { label: 'S.ATK', color: '#ff9800' },
  'special-defense': { label: 'S.DEF', color: '#03a9f4' },
  speed: { label: 'SPD', color: '#9c27b0' },
}

function FormCard({
  pokemon,
  variety,
  bgColor,
}: {
  pokemon: Pokemon
  variety: PokemonVariety
  bgColor: string
}) {
  const total = getTotalStats(pokemon)
  const artwork = pokemon.sprites.other['official-artwork'].front_default
    ?? pokemon.sprites.front_default

  return (
    <article className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex shrink-0 flex-col items-center rounded-xl bg-white p-4 dark:bg-gray-800">
          {artwork ? (
            <img
              src={artwork}
              alt={pokemon.name}
              className="h-32 w-32 object-contain drop-shadow-lg"
              loading="lazy"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-400 dark:bg-gray-700">
              Image indisponible
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-lexend text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-white">
                {formatName(pokemon.name)}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {pokemon.types.map(type => (
                  <TypeBadge key={type.type.name} typeName={type.type.name} size="sm" />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {variety.is_default && (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-500 dark:bg-red-500/10">
                  Defaut
                </span>
              )}
              <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: bgColor }}>
                Total {total}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Taille</span>
              <p className="font-bold text-gray-800 dark:text-white">{(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Poids</span>
              <p className="font-bold text-gray-800 dark:text-white">{(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Capacites
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {pokemon.abilities.map(ability => (
                <span
                  key={ability.ability.name}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >
                  {formatName(ability.ability.name)}
                  {ability.is_hidden && <span className="ml-1 text-gray-400">(cachee)</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {pokemon.stats.map(stat => {
          const config = STAT_CONFIG[stat.stat.name]
          return (
            <StatBar
              key={stat.stat.name}
              label={config?.label ?? stat.stat.name}
              value={stat.base_stat}
              color={config?.color ?? bgColor}
            />
          )
        })}
      </div>
    </article>
  )
}

export function FormsTab({ species, bgColor }: Props) {
  const varietyQueries = usePokemonVarieties(species)
  const hasAlternativeForms = (species?.varieties.length ?? 0) > 1
  const isLoading = varietyQueries.some(item => item.query.isLoading)
  const hasError = varietyQueries.some(item => item.query.isError)

  if (!species) {
    return (
      <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Chargement des formes...
      </div>
    )
  }

  if (!hasAlternativeForms) {
    return (
      <div className="rounded-xl border border-gray-100 p-6 text-center dark:border-gray-700">
        <p className="font-lexend text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Formes
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Aucune forme alternative connue.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Chargement des formes...
      </div>
    )
  }

  const loadedVarieties = varietyQueries
    .filter(item => item.query.data)
    .map(item => ({
      variety: item.variety,
      pokemon: item.query.data!,
    }))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-lexend text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Formes disponibles
        </h2>
      </div>

      {hasError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-500 dark:border-red-500/20 dark:bg-red-500/10">
          Certaines formes n'ont pas pu etre chargees.
        </div>
      )}

      <div className="space-y-4">
        {loadedVarieties.map(item => (
          <FormCard
            key={item.pokemon.name}
            pokemon={item.pokemon}
            variety={item.variety}
            bgColor={bgColor}
          />
        ))}
      </div>
    </div>
  )
}
