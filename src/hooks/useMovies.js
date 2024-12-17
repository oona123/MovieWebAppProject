import { useState, useEffect } from 'react';
import { fetchMovies, fetchMoviesWithoutKeywords } from '../api/api';

export const useMovies = (keywords, minReleaseYear, maxReleaseYear, selectedGenres, language) => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);

    useEffect(() => {
        const submitSearch = async () => {
            if (keywords) {
                const results = await fetchMovies(keywords, language);
                setMovies(results);
                filterMoviesByYearAndGenre(results);
            } else if (selectedGenres.length > 0 || minReleaseYear || maxReleaseYear) {
                const results = await fetchMoviesWithoutKeywords(minReleaseYear, maxReleaseYear, selectedGenres, language)
                setMovies(results)
                filterMoviesByYearAndGenre(results)
            } else {
                setMovies([])
                setFilteredMovies([])
            }
        };

        submitSearch();
    }, [keywords, selectedGenres, minReleaseYear, maxReleaseYear, language]);

    const filterMoviesByYearAndGenre = (moviesList) => {
        let filteredMoviesList = moviesList;

        filteredMoviesList = filteredMoviesList.filter((movie) => {
            const releaseYear = new Date(movie.release_date).getFullYear();
            return releaseYear >= minReleaseYear && releaseYear <= maxReleaseYear;
        });

        if (selectedGenres.length > 0) {
            filteredMoviesList = filteredMoviesList.filter((movie) =>
                movie.genre_ids.some((genreId) => selectedGenres.includes(genreId))
            );
        }

        setFilteredMovies(filteredMoviesList);
    };

    return { filteredMovies };
};
