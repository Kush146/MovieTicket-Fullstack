import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import { Calendar, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const Releases = () => {
  const { axios } = useAppContext()
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/show/upcoming')
        console.log('Upcoming movies response:', data)
        if (data.success) {
          setUpcomingMovies(data.movies || [])
        } else {
          console.error('API returned success:false:', data.message)
          toast.error(data.message || 'Failed to fetch upcoming movies')
          setUpcomingMovies([]) // Set empty array to show "no movies" message
        }
      } catch (error) {
        console.error('Error fetching upcoming movies:', error)
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load upcoming movies'
        console.error('Error details:', {
          message: errorMessage,
          code: error.code,
          response: error.response?.data
        })
        toast.error(errorMessage)
        setUpcomingMovies([]) // Set empty array to show "no movies" message
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingMovies()
  }, [axios])

  return (
    <div className='relative my-24 sm:my-32 md:my-40 mb-40 sm:mb-50 md:mb-60 px-4 sm:px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] pb-12'>
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8'>
        <Calendar className='w-6 h-6 sm:w-8 sm:h-8 text-red-500' />
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white'>Upcoming Releases</h1>
      </div>
      
      <p className='text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg'>
        Discover the most anticipated movies coming soon to theatres
      </p>

      {loading ? (
        <div className='flex flex-col items-center justify-center py-12 sm:py-20'>
          <Loader2 className='w-10 h-10 sm:w-12 sm:h-12 text-red-500 animate-spin mb-3 sm:mb-4' />
          <p className='text-gray-400 text-sm sm:text-base'>Loading upcoming releases...</p>
        </div>
      ) : upcomingMovies.length > 0 ? (
        <>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 justify-items-center'>
            {upcomingMovies.map((movie) => (
              <div key={movie.id || movie._id} className='relative w-full'>
                <MovieCard movie={movie} />
                {movie.release_date && new Date(movie.release_date) > new Date() && (
                  <div className='absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold'>
                    Coming {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 sm:py-20'>
          <Calendar className='w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mb-3 sm:mb-4' />
          <h2 className='text-xl sm:text-2xl font-bold text-white mb-2 text-center px-4'>No upcoming releases</h2>
          <p className='text-gray-400 text-center text-sm sm:text-base px-4'>
            Check back soon for new movie releases!
          </p>
        </div>
      )}
    </div>
  )
}

export default Releases

