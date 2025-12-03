import React, { useState, useEffect } from 'react'
import { ArrowRight, CalendarIcon, ClockIcon, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import BlurCircle from './BlurCircle'

const HeroSection = () => {
    const navigate = useNavigate()
    const { shows, image_base_url } = useAppContext()
    const [currentIndex, setCurrentIndex] = useState(0)
    
    // Get featured movies (top rated or first 3)
    const featuredMovies = shows
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 3)

    useEffect(() => {
        if (featuredMovies.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
            }, 5000) // Change every 5 seconds
            return () => clearInterval(interval)
        }
    }, [featuredMovies.length])

    const currentMovie = featuredMovies[currentIndex] || shows[0]

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
    }

    if (!currentMovie) {
        return (
            <div className='flex flex-col items-center justify-center gap-4 px-6 md:px-16 lg:px-36 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 h-screen'>
                <h1 className='text-5xl md:text-[70px] font-semibold text-white'>Welcome to KukiShow</h1>
                <p className='text-gray-300 text-lg'>Your premier movie booking platform</p>
            </div>
        )
    }

    return (
        <div className='relative flex flex-col items-start justify-center gap-4 px-4 sm:px-6 md:px-16 lg:px-36 h-screen min-h-[600px] overflow-hidden'>
            {/* Background Image with Overlay */}
            <div 
                className='absolute inset-0 bg-cover bg-center transition-opacity duration-1000'
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.5)), url(${image_base_url}${currentMovie.backdrop_path || currentMovie.poster_path})`
                }}
            />
            <div className='absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60 md:from-black/90 md:via-black/70 md:to-transparent' />

            <BlurCircle top="20%" right="10%" />
            <BlurCircle bottom="20%" left="10%" />

            {/* Content */}
            <div className='relative z-10 max-w-3xl mt-16 sm:mt-20 px-2 sm:px-0'>
                {currentMovie.genres && currentMovie.genres.length > 0 && (
                    <div className='flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
                        {currentMovie.genres.slice(0, 3).map((genre, idx) => (
                            <span key={idx} className='px-2 sm:px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-xs sm:text-sm text-red-400'>
                                {genre.name}
                            </span>
                        ))}
                    </div>
                )}

                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-[70px] md:leading-tight font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl'>
                    {currentMovie.title}
                </h1>

                <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base'>
                    {currentMovie.release_date && (
                        <div className='flex items-center gap-1.5 sm:gap-2'>
                            <CalendarIcon className='w-4 h-4 sm:w-5 sm:h-5 text-red-500'/>
                            <span>{new Date(currentMovie.release_date).getFullYear()}</span>
                        </div>
                    )}
                    {currentMovie.runtime && (
                        <div className='flex items-center gap-1.5 sm:gap-2'>
                            <ClockIcon className='w-4 h-4 sm:w-5 sm:h-5 text-red-500'/>
                            <span>{Math.floor(currentMovie.runtime / 60)}h {currentMovie.runtime % 60}m</span>
                        </div>
                    )}
                    {currentMovie.vote_average && (
                        <div className='flex items-center gap-1.5 sm:gap-2'>
                            <Star className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400'/>
                            <span className='font-semibold'>{currentMovie.vote_average.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                <p className='max-w-2xl text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-none'>
                    {currentMovie.overview}
                </p>

                <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'>
                    <button 
                        onClick={() => navigate(`/movies/${currentMovie._id}`)} 
                        className='flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-red-500 hover:bg-red-600 transition rounded-full font-semibold cursor-pointer shadow-lg shadow-red-500/50 hover:shadow-red-500/70 min-h-[44px]'
                    >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5"/>
                        Book Tickets
                    </button>
                    <button 
                        onClick={() => navigate('/movies')} 
                        className='flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-white/10 hover:bg-white/20 border border-white/20 transition rounded-full font-semibold cursor-pointer backdrop-blur-sm min-h-[44px]'
                    >
                        Explore Movies
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5"/>
                    </button>
                </div>
            </div>

            {/* Carousel Controls */}
            {featuredMovies.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className='absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition border border-white/20 min-w-[44px] min-h-[44px] flex items-center justify-center'
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                    </button>
                    <button
                        onClick={nextSlide}
                        className='absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition border border-white/20 min-w-[44px] min-h-[44px] flex items-center justify-center'
                        aria-label="Next slide"
                    >
                        <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 text-white' />
                    </button>

                    {/* Dots Indicator */}
                    <div className='absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2'>
                        {featuredMovies.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-2 rounded-full transition-all min-w-[8px] ${
                                    idx === currentIndex 
                                        ? 'w-6 sm:w-8 bg-red-500' 
                                        : 'w-2 bg-white/40 hover:bg-white/60'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default HeroSection
