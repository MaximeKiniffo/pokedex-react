export interface TypeInfo {
  type: string
  colour: string
}

export const POKEMON_TYPES: TypeInfo[] = [
  { type: 'normal',   colour: '#a8a878' },
  { type: 'fire',     colour: '#f08030' },
  { type: 'water',    colour: '#6890f0' },
  { type: 'electric', colour: '#f8d030' },
  { type: 'grass',    colour: '#78c850' },
  { type: 'ice',      colour: '#98d8d8' },
  { type: 'fighting', colour: '#c03028' },
  { type: 'poison',   colour: '#a040a0' },
  { type: 'ground',   colour: '#e0c068' },
  { type: 'flying',   colour: '#a890f0' },
  { type: 'psychic',  colour: '#f85888' },
  { type: 'bug',      colour: '#a8b820' },
  { type: 'rock',     colour: '#b8a038' },
  { type: 'ghost',    colour: '#705898' },
  { type: 'dragon',   colour: '#7038f8' },
  { type: 'dark',     colour: '#705848' },
  { type: 'steel',    colour: '#b8b8d0' },
  { type: 'fairy',    colour: '#f0b6bc' },
]

export function getTypeInfo(typeName: string): TypeInfo | undefined {
  return POKEMON_TYPES.find(t => t.type === typeName)
}
