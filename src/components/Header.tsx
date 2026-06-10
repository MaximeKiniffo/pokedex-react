import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import pokeballImg from '../static/images/pokeball-color.png'

interface Props {
  search?: string
  onSearch?: (v: string) => void
  showSearch?: boolean
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
    </svg>
  )
}

export function Header({ search = '', onSearch, showSearch = false }: Props) {
  const { isDark, toggle } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-red-100/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950/90 dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-4">
        <Link
          to="/"
          className="group flex min-w-0 shrink-0 items-center gap-2 rounded-full pr-2 transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
          aria-label="Retour à l'accueil du Pokédex"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-red-50 shadow-inner shadow-red-100 ring-1 ring-red-100 transition-colors duration-200 group-hover:bg-red-100 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <img
              src={pokeballImg}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain drop-shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-lexend text-base font-black tracking-wide text-gray-950 sm:text-xl dark:text-white">
              Pokédex
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500 sm:block">
              Explorer
            </span>
          </span>
        </Link>

        {showSearch && onSearch && (
          <div className="relative flex-1 min-w-0 max-w-xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Rechercher un Pokémon..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-gray-50/90 py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 shadow-inner shadow-gray-100 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-red-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:shadow-none dark:placeholder:text-gray-500 dark:hover:border-gray-600 dark:focus:border-red-400 dark:focus:bg-gray-900 dark:focus:ring-red-500/20"
            />
          </div>
        )}

        <button
          onClick={toggle}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:shadow-none dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:ring-offset-gray-950"
          aria-label="Basculer le mode sombre"
          type="button"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}
