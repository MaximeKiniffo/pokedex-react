import type { Pokemon, PokemonSpecies } from '../types/pokemon'
import {
  formatName,
  genderRatio,
  getFlavorText,
  getGenus,
} from '../utils/pokemon'
import { PokemonCry } from './PokemonCry'
import { TypeMatchups } from './TypeMatchups'

interface Props {
  pokemon: Pokemon
  species?: PokemonSpecies
  isLoading: boolean
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-700">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold capitalize text-gray-800 dark:text-white">
        {value}
      </div>
    </div>
  )
}

export function AboutTab({ pokemon, species, isLoading }: Props) {
  const flavorText = getFlavorText(species)
  const genus = getGenus(species)
  const badges = [
    species?.is_baby ? 'Bebe' : null,
    species?.is_legendary ? 'Legendaire' : null,
    species?.is_mythical ? 'Fabuleux' : null,
  ].filter(Boolean)

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
          Chargement des informations...
        </div>
      ) : (
        <>
          {flavorText && (
            <div className="space-y-2">
              {genus && (
                <p className="font-lexend text-sm font-semibold uppercase tracking-wider text-red-500">
                  {genus}
                </p>
              )}
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {flavorText}
              </p>
            </div>
          )}

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map(badge => (
                <span
                  key={badge}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-500 dark:bg-red-500/10"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <InfoItem label="Taille" value={`${(pokemon.height / 10).toFixed(1)} m`} />
        <InfoItem label="Poids" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
        {species && (
          <>
            <InfoItem label="Capture" value={species.capture_rate} />
            <InfoItem label="Bonheur" value={species.base_happiness ?? 'N/A'} />
            <InfoItem label="Eclosion" value={`${species.hatch_counter ?? 'N/A'} cycles`} />
            <InfoItem label="Genre" value={genderRatio(species.gender_rate)} />
          </>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-lexend text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Capacites
        </h2>
        <div className="flex flex-wrap gap-2">
          {pokemon.abilities.map(ability => (
            <span
              key={ability.ability.name}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium capitalize text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            >
              {formatName(ability.ability.name)}
              {ability.is_hidden && <span className="ml-1 text-xs text-gray-400">(cachee)</span>}
            </span>
          ))}
        </div>
      </div>

      {species && (
        <div className="space-y-3">
          <h2 className="font-lexend text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Reproduction
          </h2>
          <div className="flex flex-wrap gap-2">
            {species.egg_groups.map(group => (
              <span
                key={group.name}
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium capitalize text-gray-700 dark:bg-gray-700 dark:text-gray-200"
              >
                {formatName(group.name)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-lexend text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Cri
          </h2>
        </div>
        <PokemonCry cryUrl={pokemon.cries.latest} />
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-5 dark:border-gray-700">
        <h2 className="font-lexend text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Types defensifs
        </h2>
        <TypeMatchups typeNames={pokemon.types.map(type => type.type.name)} />
      </div>
    </div>
  )
}
