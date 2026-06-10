import { useState } from 'react'
import { motion } from 'framer-motion'
import type { EvolutionChain, Pokemon, PokemonSpecies } from '../types/pokemon'
import { getTotalStats } from '../utils/pokemon'
import { StatBar } from './StatBar'
import { AboutTab } from './AboutTab'
import { MovesTab } from './MovesTab'
import { EvolutionTab } from './EvolutionTab'
import { FormsTab } from './FormsTab'

type TabId = 'about' | 'stats' | 'moves' | 'evolution' | 'forms'

interface Props {
  pokemon: Pokemon
  species?: PokemonSpecies
  evolution?: EvolutionChain
  isSpeciesLoading: boolean
  isEvolutionLoading: boolean
  bgColor: string
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'about', label: 'A propos' },
  { id: 'stats', label: 'Stats' },
  { id: 'moves', label: 'Attaques' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'forms', label: 'Formes' },
]

const STAT_CONFIG: Record<string, { label: string; color: string }> = {
  hp: { label: 'HP', color: '#4caf50' },
  attack: { label: 'ATK', color: '#f44336' },
  defense: { label: 'DEF', color: '#2196f3' },
  'special-attack': { label: 'S.ATK', color: '#ff9800' },
  'special-defense': { label: 'S.DEF', color: '#03a9f4' },
  speed: { label: 'SPD', color: '#9c27b0' },
}

function StatsTab({ pokemon, bgColor }: { pokemon: Pokemon; bgColor: string }) {
  const total = getTotalStats(pokemon)
  const evYield = pokemon.stats
    .filter(stat => stat.effort > 0)
    .map(stat => {
      const config = STAT_CONFIG[stat.stat.name]
      return `${stat.effort} ${config?.label ?? stat.stat.name}`
    })

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
        <div>
          <h2 className="font-lexend text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Statistiques de base
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Total {total}
          </p>
        </div>
        <div className="rounded-full px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: bgColor }}>
          {total}
        </div>
      </div>

      <div className="space-y-3.5">
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

      <div className="rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-700">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          EV yield
        </div>
        <div className="mt-1 text-sm font-semibold text-gray-800 dark:text-white">
          {evYield.length ? evYield.join(' + ') : 'Aucun'}
        </div>
      </div>
    </div>
  )
}

export function PokemonTabs({
  pokemon,
  species,
  evolution,
  isSpeciesLoading,
  isEvolutionLoading,
  bgColor,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('about')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800 sm:p-6"
    >
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1 dark:bg-gray-900/70 sm:grid-cols-3 lg:grid-cols-5">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        {activeTab === 'about' && (
          <AboutTab pokemon={pokemon} species={species} isLoading={isSpeciesLoading} />
        )}
        {activeTab === 'stats' && <StatsTab pokemon={pokemon} bgColor={bgColor} />}
        {activeTab === 'moves' && <MovesTab pokemon={pokemon} />}
        {activeTab === 'evolution' && (
          <EvolutionTab evolution={evolution} isLoading={isEvolutionLoading} />
        )}
        {activeTab === 'forms' && <FormsTab species={species} bgColor={bgColor} />}
      </div>
    </motion.div>
  )
}
