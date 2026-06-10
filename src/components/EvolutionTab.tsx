import { Link } from 'react-router-dom'
import type { ChainLink, EvolutionChain } from '../types/pokemon'
import {
  artworkUrl,
  extractIdFromUrl,
  formatEvolutionDetails,
  formatName,
  hasEvolution,
} from '../utils/pokemon'

interface Props {
  evolution?: EvolutionChain
  isLoading: boolean
}

function EvolutionCard({ link }: { link: ChainLink }) {
  const id = extractIdFromUrl(link.species.url)

  return (
    <Link
      to={`/pokemons/${id - 1}`}
      className="group flex min-w-36 flex-col items-center rounded-xl border border-gray-100 bg-white px-4 py-4 text-center transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-500/40"
    >
      <img
        src={artworkUrl(id)}
        alt={link.species.name}
        className="h-24 w-24 object-contain drop-shadow-md transition group-hover:scale-105"
        loading="lazy"
      />
      <span className="mt-2 text-xs font-bold text-gray-400">
        #{String(id).padStart(3, '0')}
      </span>
      <span className="font-lexend text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-white">
        {formatName(link.species.name)}
      </span>
    </Link>
  )
}

function EvolutionNode({ link }: { link: ChainLink }) {
  return (
    <div className="flex flex-col items-center">
      <EvolutionCard link={link} />

      {link.evolves_to.length > 0 && (
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {link.evolves_to.map(child => (
            <div key={child.species.name} className="flex flex-col items-center">
              <div className="mb-3 flex max-w-44 flex-col items-center gap-1 text-center">
                <span className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
                {formatEvolutionDetails(child.evolution_details).map(detail => (
                  <span
                    key={detail}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {detail}
                  </span>
                ))}
              </div>
              <EvolutionNode link={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function EvolutionTab({ evolution, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Chargement de la chaine d'evolution...
      </div>
    )
  }

  if (!evolution || !hasEvolution(evolution.chain)) {
    return (
      <div className="rounded-xl border border-gray-100 p-6 text-center dark:border-gray-700">
        <p className="font-lexend text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Evolution
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Aucune evolution connue.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max justify-center px-2">
        <EvolutionNode link={evolution.chain} />
      </div>
    </div>
  )
}
