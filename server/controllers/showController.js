import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res)=>{
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        })

        const movies = data.results;
        res.json({success: true, movies: movies})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get upcoming movies from TMDB API
export const getUpcomingMovies = async (req, res)=>{
    try {
        console.log('Fetching upcoming movies...');
        
        // Helper function to get movies from database
        const getMoviesFromDatabase = async () => {
            const shows = await Show.find({showDateTime: {$gte: new Date()}})
                .populate('movie')
                .sort({ showDateTime: 1 });
            
            console.log(`Found ${shows.length} upcoming shows in database`);
            
            const movieMap = new Map();
            shows.forEach(show => {
                if (show.movie && show.movie._id && show.movie.title) {
                    const movieId = show.movie._id.toString();
                    if (!movieMap.has(movieId)) {
                        movieMap.set(movieId, show.movie);
                    }
                }
            });
            
            const movies = Array.from(movieMap.values());
            console.log(`Returning ${movies.length} unique upcoming movies from database`);
            return movies;
        };

        // Check if TMDB API key is set
        if (!process.env.TMDB_API_KEY) {
            console.log('TMDB_API_KEY not set, using database movies');
            const movies = await getMoviesFromDatabase();
            return res.json({success: true, movies: movies});
        }

        // Try to fetch from TMDB
        try {
            const { data } = await axios.get('https://api.themoviedb.org/3/movie/upcoming', {
                headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`},
                params: { page: 1, region: 'IN' },
                timeout: 10000 // 10 second timeout
            });

            if (data.results && data.results.length > 0) {
                console.log(`Fetched ${data.results.length} upcoming movies from TMDB`);
                return res.json({success: true, movies: data.results});
            } else {
                console.log('TMDB returned empty results, falling back to database');
                const movies = await getMoviesFromDatabase();
                return res.json({success: true, movies: movies});
            }
        } catch (tmdbError) {
            console.error('TMDB API error:', tmdbError.message);
            console.log('Falling back to database movies');
            const movies = await getMoviesFromDatabase();
            return res.json({success: true, movies: movies});
        }
    } catch (error) {
        console.error('Error in getUpcomingMovies:', error.message);
        console.error('Full error:', error);
        
        // Final fallback to database on any error
        try {
            const shows = await Show.find({showDateTime: {$gte: new Date()}})
                .populate('movie')
                .sort({ showDateTime: 1 });
            
            const movieMap = new Map();
            shows.forEach(show => {
                if (show.movie && show.movie._id && show.movie.title) {
                    const movieId = show.movie._id.toString();
                    if (!movieMap.has(movieId)) {
                        movieMap.set(movieId, show.movie);
                    }
                }
            });
            
            const movies = Array.from(movieMap.values());
            console.log(`Final fallback: Returning ${movies.length} movies from database`);
            return res.json({success: true, movies: movies});
        } catch (fallbackError) {
            console.error('Database fallback also failed:', fallbackError.message);
            return res.json({
                success: false, 
                message: 'Failed to fetch upcoming movies. Please ensure the server is running and database is connected.',
                movies: [] // Return empty array instead of undefined
            });
        }
    }
}

// API to add a new show to the database
export const addShow = async (req, res) =>{
    try {
        const {movieId, showsInput, showPrice, theatre, screenName, seatMap} = req.body

        // Find or create movie
        let movie = await Movie.findById(movieId)

        if(!movie) {
            // Fetch movie details and credits from TMDB API
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} }),

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

             const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
             }

             // Add movie to the database
             movie = await Movie.create(movieDetails);
        }

        // Use movie._id (which is the TMDB ID as a string)
        const movieIdString = movie._id.toString();

        // Set default values for optional fields if not provided
        const defaultTheatre = theatre || null;
        const defaultScreenName = screenName || "Screen 1";
        const defaultSeatMap = seatMap || null;

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieIdString, // Use movie._id (TMDB ID as string)
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    theatre: defaultTheatre,
                    screenName: defaultScreenName,
                    seatMap: defaultSeatMap,
                    occupiedSeats: {}
                })
            })
        });

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }

         //  Trigger Inngest event
         await inngest.send({
            name: "app/show.added",
             data: {movieTitle: movie.title}
         })

        res.json({success: true, message: 'Show Added successfully.'})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows from the database
export const getShows = async (req, res) =>{
    try {
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });

        // Filter unique movies by ID
        const movieMap = new Map();
        
        shows.forEach(show => {
            if (show.movie && show.movie._id) {
                const movieId = show.movie._id.toString();
                
                // Only add if not already in map and movie is properly populated
                if (!movieMap.has(movieId) && show.movie.title) {
                    movieMap.set(movieId, show.movie);
                }
            }
        });

        const uniqueMovies = Array.from(movieMap.values());
        console.log('getShows - total shows:', shows.length, 'unique movies:', uniqueMovies.length);

        res.json({success: true, shows: uniqueMovies})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;
        // get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId, showDateTime: { $gte: new Date() }})

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id })
        })

        res.json({success: true, movie, dateTime})
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get real-time seat availability for a show
export const getSeatAvailability = async (req, res) => {
    try {
        const { showId } = req.params;
        
        const show = await Show.findById(showId)
            .populate('seatMap')
            .select('occupiedSeats seatMap showDateTime');
        
        if (!show) {
            return res.json({ success: false, message: 'Show not found' });
        }

        res.json({
            success: true,
            showId: show._id,
            occupiedSeats: show.occupiedSeats || {},
            lastUpdated: new Date(),
            showDateTime: show.showDateTime
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Manual trigger for auto-add movies (for testing/admin use)
export const triggerAutoAddMovies = async (req, res) => {
    try {
        const { autoAddMoviesToTheatres } = await import('../utils/autoMovieAdder.js');
        const result = await autoAddMoviesToTheatres();
        
        res.json({
            success: result.success,
            message: result.message || 'Auto-add completed',
            details: result
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}