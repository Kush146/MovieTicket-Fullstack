import { ArrowRight, TrendingUp, Star, Calendar, Film } from 'lucide-react'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {
    const navigate = useNavigate()
    const { shows } = useAppContext()

    // Get different movie categories
    const nowShowing = shows.slice(0, 6)
    const topRated = useMemo(() => {
        return [...shows]
            .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
            .slice(0, 6)
    }, [shows])

    const upcoming = useMemo(() => {
        return [...shows]
            .filter(movie => {
                if (!movie.release_date) return false
                const releaseDate = new Date(movie.release_date)
                return releaseDate > new Date()
            })
            .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
            .slice(0, 6)
    }, [shows])

    const MovieSection = ({ title, movies, icon: Icon, iconColor = "text-red-500" }) => {
        if (movies.length === 0) return null
        
        return (
            <div className='mb-12 sm:mb-16 md:mb-20'>
                <div className='relative flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6 gap-3'>
                    <BlurCircle top='0' right='-80px'/>
                    <div className='flex items-center gap-2 sm:gap-3'>
                        {Icon && <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />}
                        <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white'>{title}</h2>
                    </div>
                    <button 
                        onClick={() => navigate('/movies')} 
                        className='group flex items-center gap-2 text-xs sm:text-sm text-gray-300 hover:text-white cursor-pointer transition'
                    >
                        View All 
                        <ArrowRight className='group-hover:translate-x-1 transition w-4 h-4 sm:w-5 sm:h-5'/>
                    </button>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 justify-items-center'>
                    {movies.map((show) => (
                        <MovieCard key={show._id} movie={show}/>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden bg-gradient-to-b from-transparent via-gray-900/50 to-transparent'>
            {/* Now Showing */}
            <MovieSection 
                title="Now Showing" 
                movies={nowShowing} 
                icon={Film}
                iconColor="text-red-500"
            />

            {/* Top Rated */}
            {topRated.length > 0 && (
                <MovieSection 
                    title="Top Rated" 
                    movies={topRated} 
                    icon={Star}
                    iconColor="text-yellow-500"
                />
            )}

            {/* Coming Soon */}
            {upcoming.length > 0 && (
                <MovieSection 
                    title="Coming Soon" 
                    movies={upcoming} 
                    icon={Calendar}
                    iconColor="text-blue-500"
                />
            )}

            {/* CTA Section */}
            <div className='flex justify-center mt-12 sm:mt-16 mb-12 sm:mb-16 md:mb-20'>
                <button 
                    onClick={() => { navigate('/movies'); scrollTo(0, 0) }}
                    className='px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition rounded-full font-semibold cursor-pointer shadow-lg shadow-red-500/50 hover:shadow-red-500/70 flex items-center gap-2 min-h-[44px]'
                >
                    <TrendingUp className='w-4 h-4 sm:w-5 sm:h-5' />
                    <span className='hidden sm:inline'>Explore All Movies</span>
                    <span className='sm:hidden'>Explore</span>
                </button>
            </div>
        </div>
    )
}

export default FeaturedSection
