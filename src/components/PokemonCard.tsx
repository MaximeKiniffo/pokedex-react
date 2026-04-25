import React from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  name: string
  index: number
}

export function PokemonCard({ name, index }: Props) {
  const navigate = useNavigate()
  const id = index + 1

  return (
    <div
      id={`pkm-${id}`}
      onClick={() => navigate(`/pokemons/${index}`)}
      className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
    >
      <div className="relative bg-gray-50 dark:bg-gray-700/50 flex justify-center pt-5 pb-3">
        <span className="absolute top-2 right-3 text-xs font-bold text-gray-400 dark:text-gray-500 font-lexend">
          #{String(id).padStart(3, '0')}
        </span>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
          alt={name}
          className="w-24 h-24 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          onError={e => {
            const img = e.currentTarget
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          }}
        />
      </div>
      <div className="px-3 py-2.5 text-center">
        <h2 className="font-lexend font-semibold text-sm uppercase tracking-wide text-gray-800 dark:text-white truncate">
          {name}
        </h2>
      </div>
    </div>
  )
}
