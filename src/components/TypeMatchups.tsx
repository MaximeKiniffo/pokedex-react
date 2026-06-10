import { useMemo } from 'react'
import { useTypeData } from '../hooks/useTypeData'
import type { TypeData } from '../types/pokemon'
import { computeTypeMatchups } from '../utils/pokemon'
import { TypeBadge } from './TypeBadge'

interface Props {
  typeNames: string[]
}

function multiplierLabel(multiplier: number) {
  if (multiplier === 0.25) return 'x1/4'
  if (multiplier === 0.5) return 'x1/2'
  return `x${multiplier}`
}

function MatchupSection({
  title,
  emptyLabel,
  matchups,
}: {
  title: string
  emptyLabel: string
  matchups: { type: string; multiplier: number }[]
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-lexend text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {title}
      </h3>
      {matchups.length ? (
        <div className="flex flex-wrap gap-2">
          {matchups.map(matchup => (
            <div
              key={matchup.type}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 pr-2 dark:bg-gray-700"
            >
              <TypeBadge typeName={matchup.type} size="sm" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-200">
                {multiplierLabel(matchup.multiplier)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 dark:text-gray-500">{emptyLabel}</p>
      )}
    </div>
  )
}

export function TypeMatchups({ typeNames }: Props) {
  const primary = useTypeData(typeNames[0])
  const secondary = useTypeData(typeNames[1])

  const typeData = useMemo(
    () => [primary.data, secondary.data].filter((data): data is TypeData => Boolean(data)),
    [primary.data, secondary.data],
  )

  if (primary.isLoading || secondary.isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
        Chargement des affinites...
      </div>
    )
  }

  if (!typeData.length) return null

  const matchups = computeTypeMatchups(typeData)
  const weaknesses = matchups.filter(matchup => matchup.multiplier > 1)
  const resistances = matchups.filter(matchup => matchup.multiplier > 0 && matchup.multiplier < 1)
  const immunities = matchups.filter(matchup => matchup.multiplier === 0)

  return (
    <div className="space-y-4">
      <MatchupSection title="Faiblesses" emptyLabel="Aucune faiblesse notable" matchups={weaknesses} />
      <MatchupSection title="Resistances" emptyLabel="Aucune resistance notable" matchups={resistances} />
      <MatchupSection title="Immunites" emptyLabel="Aucune immunite" matchups={immunities} />
    </div>
  )
}
