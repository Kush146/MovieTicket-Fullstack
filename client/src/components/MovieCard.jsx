import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'

const MovieCard = ({movie}) => {

    const navigate = useNavigate()
    const {image_base_url} = useAppContext()

  return (
    <div className='flex flex-col justify-between p-2 sm:p-3 bg-gray-800 rounded-xl sm:rounded-2xl active:scale-95 sm:hover:-translate-y-1 transition duration-300 w-full max-w-[200px] sm:max-w-none'>

      <img 
        onClick={()=> {navigate(`/movies/${movie._id || movie.id}`); scrollTo(0, 0)}}
        src={image_base_url + (movie.backdrop_path || movie.poster_path)} 
        alt={movie.title || 'Movie poster'} 
        className='rounded-lg h-40 sm:h-48 md:h-52 w-full object-cover object-right-bottom cursor-pointer'
      />

       <p className='font-semibold mt-2 truncate text-sm sm:text-base'>{movie.title}</p>

       <p className='text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 line-clamp-2'>
        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'} • {movie.genres && movie.genres.length > 0 ? movie.genres.slice(0,2).map(genre => genre.name || genre).join(" | ") : 'Upcoming'} • {movie.runtime ? timeFormat(movie.runtime) : 'TBA'}
       </p>

       <div className='flex items-center justify-between mt-3 sm:mt-4 pb-2 sm:pb-3 gap-2'>
        <button 
          onClick={()=> {navigate(`/movies/${movie._id || movie.id}`); scrollTo(0, 0)}} 
          className='px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs bg-red-500 hover:bg-red-600 transition rounded-full font-medium cursor-pointer flex-1 min-h-[32px] sm:min-h-[36px]'
        >
          View Details
        </button>

        <p className='flex items-center gap-1 text-xs sm:text-sm text-gray-400 flex-shrink-0'>
            <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500"/>
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </p>
       </div>

    </div>
  )
}

export default MovieCard
