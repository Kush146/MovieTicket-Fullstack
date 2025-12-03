import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, X, Film, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const MovieSearch = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { shows, image_base_url } = useAppContext()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsLoading(true)
      // Simulate search delay for better UX
      const timer = setTimeout(() => {
        const filtered = shows.filter(movie => 
          movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres?.some(g => g.name?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        setResults(filtered.slice(0, 8))
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [searchQuery, shows])

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`)
    onClose()
    scrollTo(0, 0)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  const searchContent = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-start justify-center pt-24 md:pt-32 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-white/10 bg-gray-800/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies by title, genre, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-white/60">
              <div className="inline-block w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p>Searching...</p>
            </div>
          ) : searchQuery.trim().length > 0 && results.length === 0 ? (
            <div className="p-8 text-center">
              <Film className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60">No movies found matching "{searchQuery}"</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((movie) => (
                <div
                  key={movie._id}
                  onClick={() => handleMovieClick(movie._id)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition group"
                >
                  <img
                    src={image_base_url + (movie.poster_path || movie.backdrop_path)}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-red-400 transition truncate">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">
                      {movie.overview}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                      {movie.genres?.slice(0, 2).map((g, i) => (
                        <span key={i}>{g.name}</span>
                      ))}
                      {movie.release_date && (
                        <>
                          <span>•</span>
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-white/60">
              <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p>Start typing to search for movies...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(searchContent, document.body)
}

export default MovieSearch

