import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import Theatre from "../models/Theatre.js";
import { generateSeatMapForTheatre } from "./seatMapGenerator.js";

/**
 * Automatically add movies to theatres
 * Fetches popular movies from TMDB and assigns 3-5 movies per theatre
 */
export const autoAddMoviesToTheatres = async () => {
    try {
        console.log('Starting automatic movie addition...');

        // Fetch now playing and popular movies from TMDB
        const [nowPlayingResponse, popularResponse] = await Promise.all([
            axios.get('https://api.themoviedb.org/3/movie/now_playing', {
                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
                params: { page: 1, region: 'IN' }
            }),
            axios.get('https://api.themoviedb.org/3/movie/popular', {
                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
                params: { page: 1, region: 'IN' }
            })
        ]);

        // Combine and deduplicate movies
        const allMovies = [
            ...nowPlayingResponse.data.results,
            ...popularResponse.data.results
        ];
        
        const uniqueMovies = Array.from(
            new Map(allMovies.map(movie => [movie.id, movie])).values()
        ).slice(0, 20); // Get top 20 unique movies

        // Get all theatres
        const theatres = await Theatre.find({});
        
        if (theatres.length === 0) {
            console.log('No theatres found. Please add theatres first.');
            return { success: false, message: 'No theatres found' };
        }

        const moviesAdded = [];
        const showsCreated = [];

        // Process each theatre
        for (const theatre of theatres) {
            // Randomly assign 3-5 movies per theatre
            const moviesPerTheatre = Math.floor(Math.random() * 3) + 3; // 3-5 movies
            const shuffledMovies = [...uniqueMovies].sort(() => Math.random() - 0.5);
            const theatreMovies = shuffledMovies.slice(0, moviesPerTheatre);

            // Get or create screen
            let screen = theatre.screens && theatre.screens.length > 0 
                ? theatre.screens[0] 
                : { name: 'Screen 1', seatMap: null };

            // Generate or get seat map for this theatre
            let seatMapId = screen.seatMap;
            if (!seatMapId) {
                seatMapId = await generateSeatMapForTheatre(
                    theatre._id,
                    theatre.name,
                    screen.name
                );
                
                // Update theatre with seat map
                if (!theatre.screens || theatre.screens.length === 0) {
                    theatre.screens = [{ name: screen.name, seatMap: seatMapId }];
                } else {
                    theatre.screens[0].seatMap = seatMapId;
                }
                await theatre.save();
            }

            // Process each movie for this theatre
            for (const movieData of theatreMovies) {
                try {
                    // Find or create movie in database
                    let movie = await Movie.findById(movieData.id.toString());
                    
                    if (!movie) {
                        // Fetch full movie details and credits
                        const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                            axios.get(`https://api.themoviedb.org/3/movie/${movieData.id}`, {
                                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                            }),
                            axios.get(`https://api.themoviedb.org/3/movie/${movieData.id}/credits`, {
                                headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                            })
                        ]);

                        const movieApiData = movieDetailsResponse.data;
                        const movieCreditsData = movieCreditsResponse.data;

                        const movieDetails = {
                            _id: movieData.id.toString(),
                            title: movieApiData.title,
                            overview: movieApiData.overview,
                            poster_path: movieApiData.poster_path,
                            backdrop_path: movieApiData.backdrop_path,
                            genres: movieApiData.genres || [],
                            casts: movieCreditsData.cast?.slice(0, 20) || [],
                            release_date: movieApiData.release_date,
                            original_language: movieApiData.original_language,
                            tagline: movieApiData.tagline || "",
                            vote_average: movieApiData.vote_average || 0,
                            runtime: movieApiData.runtime || 120,
                        };

                        movie = await Movie.create(movieDetails);
                        moviesAdded.push(movie.title);
                    }

                    // Create shows for next 7 days
                    const showTimes = ['10:00', '13:30', '17:00', '20:30']; // 4 shows per day
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    for (let day = 0; day < 7; day++) {
                        const showDate = new Date(today);
                        showDate.setDate(today.getDate() + day);

                        for (const time of showTimes) {
                            const [hours, minutes] = time.split(':');
                            const showDateTime = new Date(showDate);
                            showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                            // Skip if show time is in the past
                            if (showDateTime < new Date()) continue;

                            // Check if show already exists
                            const existingShow = await Show.findOne({
                                movie: movie._id.toString(),
                                theatre: theatre._id,
                                showDateTime: showDateTime
                            });

                            if (!existingShow) {
                                // Random price between $8 and $15
                                const showPrice = Math.floor(Math.random() * 7) + 8;

                                const show = await Show.create({
                                    movie: movie._id.toString(),
                                    theatre: theatre._id,
                                    screenName: screen.name,
                                    showDateTime: showDateTime,
                                    showPrice: showPrice,
                                    seatMap: seatMapId,
                                    occupiedSeats: {}
                                });

                                showsCreated.push({
                                    movie: movie.title,
                                    theatre: theatre.name,
                                    dateTime: showDateTime
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error processing movie ${movieData.id}:`, error.message);
                }
            }
        }

        console.log(`Auto-add complete: ${moviesAdded.length} movies added, ${showsCreated.length} shows created`);

        return {
            success: true,
            moviesAdded: moviesAdded.length,
            showsCreated: showsCreated.length,
            details: {
                movies: moviesAdded,
                shows: showsCreated.slice(0, 10) // First 10 for logging
            }
        };
    } catch (error) {
        console.error('Error in autoAddMoviesToTheatres:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

