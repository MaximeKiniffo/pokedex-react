import { POKEMON_TYPES } from '../data/types'
import type {
  ChainLink,
  EvolutionDetail,
  MoveDetail,
  NamedResource,
  Pokemon,
  PokemonMove,
  PokemonSpecies,
  TypeData,
} from '../types/pokemon'

export const LATEST_MAINLINE_MOVE_VERSION_GROUP = 'scarlet-violet'

export interface LearnedMove {
  name: string
  url: string
  method: string
  level: number
}

export interface MoveGroup {
  method: string
  label: string
  moves: LearnedMove[]
}

export interface TypeMatchup {
  type: string
  multiplier: number
}

const MOVE_METHOD_LABELS: Record<string, string> = {
  'level-up': 'Niveau',
  machine: 'CT / CS',
  egg: 'Reproduction',
  tutor: 'Tuteur',
  'form-change': 'Changement de forme',
  stadium: 'Stade',
  'light-ball-egg': 'Reproduction',
  'colosseum-purification': 'Purification',
  'xd-shadow': 'XD',
}

const MOVE_METHOD_ORDER = ['level-up', 'machine', 'egg', 'tutor', 'form-change']

const DAMAGE_CLASS_LABELS: Record<string, string> = {
  physical: 'Physique',
  special: 'Special',
  status: 'Statut',
}

const TIME_OF_DAY_LABELS: Record<string, string> = {
  day: 'jour',
  night: 'nuit',
}

export function extractIdFromUrl(url: string) {
  const parts = url.split('/').filter(Boolean)
  return parseInt(parts[parts.length - 1], 10)
}

export function formatName(name: string) {
  return name.replace(/-/g, ' ')
}

export function artworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function cleanPokemonText(text: string) {
  return text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function pickLocalized<T extends { language: NamedResource }>(
  entries: T[],
  picker: (entry: T) => string,
) {
  const entry = entries.find(item => item.language.name === 'fr')
    ?? entries.find(item => item.language.name === 'en')
  return entry ? cleanPokemonText(picker(entry)) : ''
}

export function getFlavorText(species?: PokemonSpecies) {
  if (!species) return ''
  return pickLocalized(species.flavor_text_entries, entry => entry.flavor_text)
}

export function getGenus(species?: PokemonSpecies) {
  if (!species) return ''
  return pickLocalized(species.genera, entry => entry.genus)
}

export function getLocalizedMoveName(move?: MoveDetail) {
  if (!move) return ''
  return pickLocalized(move.names, entry => entry.name) || formatName(move.name)
}

export function getMoveDescription(move?: MoveDetail) {
  if (!move) return ''

  const flavor = pickLocalized(move.flavor_text_entries, entry => entry.flavor_text)
  if (flavor) return flavor

  const effect = pickLocalized(
    move.effect_entries,
    entry => entry.short_effect || entry.effect,
  )

  return effect.replace(/\$effect_chance/g, String(move.effect_chance ?? ''))
}

export function getDamageClassLabel(className: string) {
  return DAMAGE_CLASS_LABELS[className] ?? formatName(className)
}

export function getMoveMethodLabel(method: string) {
  return MOVE_METHOD_LABELS[method] ?? formatName(method)
}

export function groupScarletVioletMoves(moves: PokemonMove[]): MoveGroup[] {
  const deduped = new Map<string, LearnedMove>()

  moves.forEach(pokemonMove => {
    pokemonMove.version_group_details
      .filter(detail => detail.version_group.name === LATEST_MAINLINE_MOVE_VERSION_GROUP)
      .forEach(detail => {
        const method = detail.move_learn_method.name
        const key = `${method}:${pokemonMove.move.name}`
        const existing = deduped.get(key)
        const learnedMove: LearnedMove = {
          name: pokemonMove.move.name,
          url: pokemonMove.move.url,
          method,
          level: detail.level_learned_at,
        }

        if (!existing) {
          deduped.set(key, learnedMove)
          return
        }

        if (method === 'level-up' && learnedMove.level < existing.level) {
          deduped.set(key, learnedMove)
        }
      })
  })

  const grouped = Array.from(deduped.values()).reduce<Record<string, LearnedMove[]>>((acc, move) => {
    acc[move.method] = acc[move.method] ?? []
    acc[move.method].push(move)
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([method, methodMoves]) => ({
      method,
      label: getMoveMethodLabel(method),
      moves: methodMoves.sort((a, b) => {
        if (method === 'level-up' && a.level !== b.level) return a.level - b.level
        return a.name.localeCompare(b.name)
      }),
    }))
    .sort((a, b) => {
      const indexA = MOVE_METHOD_ORDER.indexOf(a.method)
      const indexB = MOVE_METHOD_ORDER.indexOf(b.method)
      const orderA = indexA === -1 ? MOVE_METHOD_ORDER.length : indexA
      const orderB = indexB === -1 ? MOVE_METHOD_ORDER.length : indexB
      return orderA - orderB || a.label.localeCompare(b.label)
    })
}

export function computeTypeMatchups(typeData: TypeData[]): TypeMatchup[] {
  const multipliers = POKEMON_TYPES.reduce<Record<string, number>>((acc, type) => {
    acc[type.type] = 1
    return acc
  }, {})

  typeData.forEach(data => {
    data.damage_relations.double_damage_from.forEach(type => {
      multipliers[type.name] *= 2
    })
    data.damage_relations.half_damage_from.forEach(type => {
      multipliers[type.name] *= 0.5
    })
    data.damage_relations.no_damage_from.forEach(type => {
      multipliers[type.name] = 0
    })
  })

  return POKEMON_TYPES.map(type => ({
    type: type.type,
    multiplier: multipliers[type.type],
  }))
}

export function genderRatio(genderRate: number) {
  if (genderRate === -1) return 'Asexue'

  const female = (genderRate / 8) * 100
  const male = 100 - female
  return `${male.toFixed(male % 1 === 0 ? 0 : 1)}% male / ${female.toFixed(female % 1 === 0 ? 0 : 1)}% femelle`
}

export function formatEvolutionDetails(details: EvolutionDetail[]) {
  if (details.length === 0) return ['Pokemon de base']

  return details.map(detail => {
    const chunks: string[] = []

    if (detail.trigger.name === 'level-up') {
      chunks.push(detail.min_level ? `Niveau ${detail.min_level}` : 'Niveau')
    } else if (detail.trigger.name === 'use-item') {
      chunks.push(detail.item ? `Utiliser ${formatName(detail.item.name)}` : 'Objet')
    } else if (detail.trigger.name === 'trade') {
      chunks.push('Echange')
    } else {
      chunks.push(formatName(detail.trigger.name))
    }

    if (detail.held_item) chunks.push(`tenir ${formatName(detail.held_item.name)}`)
    if (detail.known_move) chunks.push(`connaitre ${formatName(detail.known_move.name)}`)
    if (detail.known_move_type) chunks.push(`attaque ${formatName(detail.known_move_type.name)}`)
    if (detail.location) chunks.push(`a ${formatName(detail.location.name)}`)
    if (detail.min_happiness) chunks.push(`bonheur ${detail.min_happiness}+`)
    if (detail.min_affection) chunks.push(`affection ${detail.min_affection}+`)
    if (detail.min_beauty) chunks.push(`beaute ${detail.min_beauty}+`)
    if (detail.time_of_day) chunks.push(TIME_OF_DAY_LABELS[detail.time_of_day] ?? detail.time_of_day)
    if (detail.needs_overworld_rain) chunks.push('sous la pluie')
    if (detail.party_species) chunks.push(`avec ${formatName(detail.party_species.name)}`)
    if (detail.party_type) chunks.push(`avec type ${formatName(detail.party_type.name)}`)
    if (detail.trade_species) chunks.push(`contre ${formatName(detail.trade_species.name)}`)
    if (detail.turn_upside_down) chunks.push('console retournee')
    if (detail.relative_physical_stats === 1) chunks.push('attaque > defense')
    if (detail.relative_physical_stats === 0) chunks.push('attaque = defense')
    if (detail.relative_physical_stats === -1) chunks.push('attaque < defense')

    return chunks.join(' - ')
  })
}

export function hasEvolution(chain?: ChainLink) {
  return Boolean(chain?.evolves_to.length)
}

export function getTotalStats(pokemon: Pokemon) {
  return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)
}
