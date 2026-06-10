import { useMemo, useState } from 'react'
import { useMove } from '../hooks/useMove'
import type { MoveGroup } from '../utils/pokemon'
import {
  formatName,
  getDamageClassLabel,
  getLocalizedMoveName,
  getMoveDescription,
  groupScarletVioletMoves,
  LATEST_MAINLINE_MOVE_VERSION_GROUP,
} from '../utils/pokemon'
import type { Pokemon } from '../types/pokemon'
import { TypeBadge } from './TypeBadge'

interface Props {
  pokemon: Pokemon
}

function MoveDetailPanel({ moveName }: { moveName: string }) {
  const { data: move, isLoading, isError } = useMove(moveName)

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Chargement de l'attaque...
      </div>
    )
  }

  if (isError || !move) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-500 dark:border-red-500/20 dark:bg-red-500/10">
        Detail indisponible
      </div>
    )
  }

  const description = getMoveDescription(move)

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-lexend text-base font-bold capitalize text-gray-800 dark:text-white">
            {getLocalizedMoveName(move)}
          </h4>
          <p className="mt-1 text-sm capitalize text-gray-500 dark:text-gray-400">
            {getDamageClassLabel(move.damage_class.name)}
          </p>
        </div>
        <TypeBadge typeName={move.type.name} size="md" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Puissance</span>
          <p className="font-bold text-gray-800 dark:text-white">{move.power ?? 'N/A'}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Precision</span>
          <p className="font-bold text-gray-800 dark:text-white">{move.accuracy ? `${move.accuracy}%` : 'N/A'}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">PP</span>
          <p className="font-bold text-gray-800 dark:text-white">{move.pp ?? 'N/A'}</p>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Priorite</span>
          <p className="font-bold text-gray-800 dark:text-white">{move.priority}</p>
        </div>
      </div>

      {description && (
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {description}
        </p>
      )}
    </div>
  )
}

function MoveSection({
  group,
  selectedMoveKey,
  onSelectMove,
}: {
  group: MoveGroup
  selectedMoveKey: string | null
  onSelectMove: (moveKey: string) => void
}) {
  const [isOpen, setIsOpen] = useState(group.method === 'level-up')

  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left transition hover:bg-gray-100 dark:bg-gray-900/40 dark:hover:bg-gray-700/60"
      >
        <span className="font-lexend text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
          {group.label}
        </span>
        <span className="text-xs font-bold text-gray-400">
          {group.moves.length} {isOpen ? '-' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {group.moves.map(move => {
            const moveKey = `${move.method}:${move.name}`

            return (
              <div key={moveKey} className="p-3">
                <button
                  type="button"
                  onClick={() => onSelectMove(moveKey)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <span className="text-sm font-semibold capitalize text-gray-800 dark:text-white">
                    {formatName(move.name)}
                  </span>
                  <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-gray-400">
                    {move.method === 'level-up' ? `Niv. ${move.level}` : group.label}
                  </span>
                </button>

                {selectedMoveKey === moveKey && (
                  <div className="mt-3">
                    <MoveDetailPanel moveName={move.name} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export function MovesTab({ pokemon }: Props) {
  const [selectedMoveKey, setSelectedMoveKey] = useState<string | null>(null)
  const groups = useMemo(() => groupScarletVioletMoves(pokemon.moves), [pokemon.moves])
  const total = groups.reduce((count, group) => count + group.moves.length, 0)

  const handleSelectMove = (moveKey: string) => {
    setSelectedMoveKey(current => current === moveKey ? null : moveKey)
  }

  if (!total) {
    return (
      <div className="rounded-xl border border-gray-100 p-6 text-center dark:border-gray-700">
        <p className="font-lexend text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Scarlet / Violet
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Aucune attaque disponible pour cette version principale.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-lexend text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Scarlet / Violet
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} attaques dans {LATEST_MAINLINE_MOVE_VERSION_GROUP}
          </p>
        </div>
      </div>

      {groups.map(group => (
        <MoveSection
          key={group.method}
          group={group}
          selectedMoveKey={selectedMoveKey}
          onSelectMove={handleSelectMove}
        />
      ))}
    </div>
  )
}
