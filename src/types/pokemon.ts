export interface PokemonListItem {
  name: string
  url: string
}

export interface NamedResource {
  name: string
  url: string
}

export interface PokemonType {
  slot: number
  type: NamedResource
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedResource
}

export interface PokemonAbility {
  ability: NamedResource
  is_hidden: boolean
  slot: number
}

export interface PokemonSprites {
  front_default: string
  other: {
    'official-artwork': {
      front_default: string
    }
  }
}

export interface PokemonMoveVersion {
  level_learned_at: number
  move_learn_method: NamedResource
  version_group: NamedResource
}

export interface PokemonMove {
  move: NamedResource
  version_group_details: PokemonMoveVersion[]
}

export interface PokemonCries {
  latest: string | null
  legacy: string | null
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  sprites: PokemonSprites
  moves: PokemonMove[]
  cries: PokemonCries
}

export interface LocalizedTextEntry {
  language: NamedResource
}

export interface PokemonFlavorTextEntry extends LocalizedTextEntry {
  flavor_text: string
  version?: NamedResource
}

export interface PokemonGenusEntry extends LocalizedTextEntry {
  genus: string
}

export interface PokemonSpecies {
  id: number
  name: string
  base_happiness: number | null
  capture_rate: number
  color: NamedResource
  egg_groups: NamedResource[]
  evolution_chain: {
    url: string
  }
  flavor_text_entries: PokemonFlavorTextEntry[]
  gender_rate: number
  genera: PokemonGenusEntry[]
  habitat: NamedResource | null
  hatch_counter: number | null
  is_baby: boolean
  is_legendary: boolean
  is_mythical: boolean
}

export interface EvolutionDetail {
  gender: number | null
  held_item: NamedResource | null
  item: NamedResource | null
  known_move: NamedResource | null
  known_move_type: NamedResource | null
  location: NamedResource | null
  min_affection: number | null
  min_beauty: number | null
  min_happiness: number | null
  min_level: number | null
  needs_overworld_rain: boolean
  party_species: NamedResource | null
  party_type: NamedResource | null
  relative_physical_stats: number | null
  time_of_day: string
  trade_species: NamedResource | null
  trigger: NamedResource
  turn_upside_down: boolean
}

export interface ChainLink {
  evolution_details: EvolutionDetail[]
  evolves_to: ChainLink[]
  is_baby: boolean
  species: NamedResource
}

export interface EvolutionChain {
  id: number
  chain: ChainLink
}

export interface TypeRelations {
  double_damage_from: NamedResource[]
  double_damage_to: NamedResource[]
  half_damage_from: NamedResource[]
  half_damage_to: NamedResource[]
  no_damage_from: NamedResource[]
  no_damage_to: NamedResource[]
}

export interface TypeData {
  id: number
  name: string
  damage_relations: TypeRelations
}

export interface MoveNameEntry extends LocalizedTextEntry {
  name: string
}

export interface MoveEffectEntry extends LocalizedTextEntry {
  effect: string
  short_effect: string
}

export interface MoveFlavorTextEntry extends LocalizedTextEntry {
  flavor_text: string
  version_group: NamedResource
}

export interface MoveDetail {
  id: number
  name: string
  accuracy: number | null
  damage_class: NamedResource
  effect_chance: number | null
  effect_entries: MoveEffectEntry[]
  flavor_text_entries: MoveFlavorTextEntry[]
  names: MoveNameEntry[]
  power: number | null
  pp: number | null
  priority: number
  type: NamedResource
}
