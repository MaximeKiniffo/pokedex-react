import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { Header } from './components/Header'
import { PokemonGrid } from './components/PokemonGrid'
import { PokemonDetail } from './components/PokemonDetail'

function AppRoutes() {
  const [search, setSearch] = useState('')

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header showSearch search={search} onSearch={setSearch} />
            <PokemonGrid search={search} />
          </>
        }
      />
      <Route
        path="/pokemons/:id"
        element={
          <>
            <Header />
            <PokemonDetail />
          </>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
