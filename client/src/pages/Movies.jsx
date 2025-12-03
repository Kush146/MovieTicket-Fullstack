import React, { useState, useMemo } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import { Filter, X, SlidersHorizontal, Star, Calendar, TrendingUp, Film } from 'lucide-react'

const Movies = () => {
  const { shows } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('popularity') // popularity, rating, date, title
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique genres
  const allGenres = useMemo(() => {
    const genreSet = new Set()
    shows.forEach(movie => {
      movie.genres?.forEach(genre => genreSet.add(genre.name))
    })
    return Array.from(genreSet).sort()
  }, [shows])

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = shows.filter(movie => {
      // Search filter
      const matchesSearch = !searchQuery || 
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.overview?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Genre filter
      const matchesGenres = selectedGenres.length === 0 ||
        movie.genres?.some(g => selectedGenres.includes(g.name))
      
      // Rating filter
      const matchesRating = movie.vote_average >= minRating

      return matchesSearch && matchesGenres && matchesRating
    })

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0)
        case 'date':
          return new Date(b.release_date || 0) - new Date(a.release_date || 0)
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'popularity':
        default:
          return (b.vote_average || 0) - (a.vote_average || 0)
      }
    })

    return filtered
  }, [shows, searchQuery, selectedGenres, minRating, sortBy])

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenres([])
    setMinRating(0)
    setSortBy('popularity')
  }

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || minRating > 0

  return shows.length > 0 ? (
    <div className='relative my-24 sm:my-32 md:my-40 mb-40 sm:mb-50 md:mb-60 px-4 sm:px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      {/* Header with Search and Filters */}
      <div className='mb-6 sm:mb-8'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white'>Now Showing</h1>
          <div className='flex items-center gap-2 sm:gap-3'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition text-sm sm:text-base min-h-[44px]'
            >
              <SlidersHorizontal className='w-4 h-4' />
              <span className='hidden sm:inline'>Filters</span>
              {hasActiveFilters && (
                <span className='bg-red-500 text-white text-xs px-2 py-0.5 rounded-full'>
                  {selectedGenres.length + (minRating > 0 ? 1 : 0) + (searchQuery ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className='relative mb-4'>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-4 py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base min-h-[44px]'
          />
          <Filter className='absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40' />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white p-1'
              aria-label="Clear search"
            >
              <X className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className='bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6'>
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
              <h3 className='text-base sm:text-lg font-semibold text-white flex items-center gap-2'>
                <Filter className='w-4 h-4 sm:w-5 sm:h-5 text-red-500' />
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className='text-xs sm:text-sm text-red-400 hover:text-red-300 transition min-h-[32px] px-2'
                >
                  Clear All
                </button>
              )}
            </div>

            <div className='grid md:grid-cols-2 gap-4 sm:gap-6'>
              {/* Genre Filter */}
              <div>
                <label className='block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base'>Genres</label>
                <div className='flex flex-wrap gap-2'>
                  {allGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition min-h-[32px] ${
                        selectedGenres.includes(genre)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className='block text-white font-medium mb-2 sm:mb-3 text-sm sm:text-base'>
                  Minimum Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                </label>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className='flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500'
                  />
                  <div className='flex items-center gap-1 text-white/60'>
                    <Star className='w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400' />
                    <span className='text-xs sm:text-sm'>{minRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
          <span className='text-white/60 text-xs sm:text-sm'>Sort by:</span>
          <div className='flex flex-wrap gap-2'>
            {[
              { value: 'popularity', label: 'Popularity', icon: TrendingUp },
              { value: 'rating', label: 'Rating', icon: Star },
              { value: 'date', label: 'Date', icon: Calendar },
              { value: 'title', label: 'Title', icon: Filter }
            ].map(option => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition min-h-[36px] ${
                    sortBy === option.value
                      ? 'bg-red-500 text-white'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <Icon className='w-3 h-3 sm:w-4 sm:h-4' />
                  <span className='hidden sm:inline'>{option.label}</span>
                  <span className='sm:hidden'>{option.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Count */}
        <p className='text-white/60 text-xs sm:text-sm mb-3 sm:mb-4'>
          Showing {filteredAndSortedMovies.length} of {shows.length} movies
        </p>
      </div>

      {/* Movies Grid */}
      {filteredAndSortedMovies.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 justify-items-center'>
          {filteredAndSortedMovies.map((movie) => (
            <MovieCard movie={movie} key={movie._id}/>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 sm:py-20'>
          <Film className='w-12 h-12 sm:w-16 sm:h-16 text-white/20 mb-3 sm:mb-4' />
          <h2 className='text-xl sm:text-2xl font-bold text-white mb-2 text-center px-4'>No movies found</h2>
          <p className='text-white/60 text-center mb-4 px-4 text-sm sm:text-base'>
            Try adjusting your filters or search query
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className='px-5 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm sm:text-base min-h-[44px]'
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No movies available</h1>
    </div>
  )
}

export default Movies
