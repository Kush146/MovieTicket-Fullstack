import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MovieDetails = () => {

  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)

  const {shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url} = useAppContext()

  const getShow = async ()=>{
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if(data.success){
        setShow(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFavorite = async ()=>{
    try {
      if(!user) return toast.error("Please login to proceed");

      const { data } = await axios.post('/api/user/update-favorite', {movieId: id}, {headers: { Authorization: `Bearer ${await getToken()}` }})

      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    getShow()
  },[id])

  return show ? (
    <div className='px-4 sm:px-6 md:px-16 lg:px-40 pt-24 sm:pt-28 md:pt-40 pb-12'>
      <div className='flex flex-col md:flex-row gap-6 sm:gap-8 max-w-6xl mx-auto'>

        <img 
          src={image_base_url + show.movie.poster_path} 
          alt="" 
          className='w-full max-w-[280px] sm:max-w-[320px] md:max-w-none mx-auto md:mx-0 rounded-xl h-auto md:h-[500px] object-cover flex-shrink-0'
        />

        <div className='relative flex flex-col gap-3 sm:gap-4'>
          <BlurCircle top="-100px" left="-100px"/>
          <p className='text-red-500 text-sm sm:text-base font-medium'>ENGLISH</p>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold text-balance'>{show.movie.title}</h1>
          <div className='flex items-center gap-2 text-gray-300 text-sm sm:text-base'>
            <StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500"/>
            <span>{show.movie.vote_average.toFixed(1)} User Rating</span>
          </div>

          <p className='text-gray-400 mt-2 text-sm sm:text-base leading-relaxed'>{show.movie.overview}</p>

          <p className='text-sm sm:text-base text-gray-300'>
            {timeFormat(show.movie.runtime)} • {show.movie.genres?.map(genre => genre.name).join(", ") || "N/A"} • {show.movie.release_date?.split("-")[0] || "N/A"}
          </p>

          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4'>
            <button className='flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95 min-h-[44px]'>
              <PlayCircleIcon className="w-4 h-4 sm:w-5 sm:h-5"/>
              Watch Trailer
            </button>
            <a 
              href="#dateSelect" 
              className='px-6 sm:px-10 py-2.5 sm:py-3 text-sm bg-red-500 hover:bg-red-600 transition rounded-md font-medium cursor-pointer active:scale-95 text-center min-h-[44px] flex items-center justify-center'
            >
              Buy Tickets
            </a>
            <button 
              onClick={handleFavorite} 
              className='bg-gray-700 p-2.5 sm:p-3 rounded-full transition cursor-pointer active:scale-95 self-center sm:self-auto min-w-[44px] min-h-[44px] flex items-center justify-center'
            >
              <Heart className={`w-5 h-5 ${favoriteMovies.find(movie => movie._id === id) ? 'fill-red-500 text-red-500' : ""} `}/>
            </button>
          </div>
        </div>
      </div>

      <p className='text-base sm:text-lg font-medium mt-12 sm:mt-16 md:mt-20 mb-4 sm:mb-6'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-4 sm:mt-6 pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6'>
        <div className='flex items-center gap-3 sm:gap-4 w-max'>
          {show.movie.casts?.slice(0,12).map((cast,index)=> (
            <div key={index} className='flex flex-col items-center text-center min-w-[80px] sm:min-w-[100px]'>
              <img 
                src={image_base_url + (cast.profile_path || '/placeholder.jpg')} 
                alt={cast.name} 
                className='rounded-full h-16 w-16 sm:h-20 sm:w-20 object-cover'
              />
              <p className='font-medium text-xs mt-2 sm:mt-3 line-clamp-2'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div id="dateSelect">
        <DateSelect dateTime={show.dateTime} id={id}/>
      </div>

      <p className='text-base sm:text-lg font-medium mt-12 sm:mt-16 md:mt-20 mb-6 sm:mb-8'>You May Also Like</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center'>
          {shows.slice(0,4).map((movie, index)=> (
            <MovieCard key={index} movie={movie}/>
          ))}
      </div>
      <div className='flex justify-center mt-12 sm:mt-16 md:mt-20'>
          <button 
            onClick={()=> {navigate('/movies'); scrollTo(0,0)}} 
            className='px-8 sm:px-10 py-2.5 sm:py-3 text-sm bg-red-500 hover:bg-red-600 transition rounded-md font-medium cursor-pointer min-h-[44px]'
          >
            Show more
          </button>
      </div>

    </div>
  ) : <Loading />
}

export default MovieDetails
