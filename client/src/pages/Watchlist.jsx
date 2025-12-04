import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import { Bookmark } from 'lucide-react'

const Watchlist = () => {
  const { watchlistMovies, fetchWatchlist } = useAppContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWatchlist = async () => {
      setLoading(true)
      await fetchWatchlist()
      setLoading(false)
    }
    loadWatchlist()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[80vh]'>
        <div className='text-gray-400'>Loading watchlist...</div>
      </div>
    )
  }

  return watchlistMovies.length > 0 ? (
    <div className='relative my-40 mb-60 px-4 sm:px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      <div className='flex items-center gap-3 mb-6'>
        <Bookmark className='w-6 h-6 text-red-500 fill-red-500' />
        <h1 className='text-2xl sm:text-3xl font-semibold'>My Watchlist</h1>
        <span className='text-gray-400 text-sm'>({watchlistMovies.length})</span>
      </div>
      
      <div className='flex flex-wrap max-sm:justify-center gap-6 sm:gap-8'>
        {watchlistMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-4'>
      <Bookmark className='w-16 h-16 text-gray-600 mb-4' />
      <h1 className='text-2xl sm:text-3xl font-bold text-center mb-2'>Your Watchlist is Empty</h1>
      <p className='text-gray-400 text-center mb-6 max-w-md'>
        Save movies you want to watch later by clicking the bookmark icon on any movie page.
      </p>
    </div>
  )
}

export default Watchlist

