import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [watchlistMovies, setWatchlistMovies] = useState([])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async ()=>{
        try {
            if (!user) {
                setIsAdmin(false)
                return
            }
            
            // Check if user email matches admin email
            const userEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress
            const ADMIN_EMAIL = "kushkore.work@gmail.com"
            const isAdminUser = userEmail === ADMIN_EMAIL
            
            // Also verify with backend
            try {
                const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})
                setIsAdmin(data.isAdmin && isAdminUser)
            } catch {
                // If backend check fails, use frontend check
                setIsAdmin(isAdminUser)
            }

            if(!isAdminUser && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error('Admin check failed:', error)
            setIsAdmin(false)
        }
    }

    const fetchShows = async ()=>{
        try {
            const { data } = await axios.get('/api/show/all')
            if(data.success){
                // Filter out any null/undefined movies
                const validMovies = (data.shows || []).filter(movie => movie && movie._id && movie.title)
                setShows(validMovies)
                console.log('Movies loaded:', validMovies.length)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching shows:', error)
            toast.error('Failed to load movies')
        }
    }

    const fetchFavoriteMovies = async ()=>{
        try {
            const { data } = await axios.get('/api/user/favorites', {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setFavoriteMovies(data.movies)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchWatchlist = async ()=>{
        try {
            if (!user) {
                setWatchlistMovies([])
                return
            }
            const { data } = await axios.get('/api/user/watchlist', {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setWatchlistMovies(data.movies)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchShows()
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin()
            fetchFavoriteMovies()
            fetchWatchlist()
        } else {
            setWatchlistMovies([])
        }
    },[user])

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, 
        favoriteMovies, fetchFavoriteMovies, 
        watchlistMovies, fetchWatchlist,
        image_base_url
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)