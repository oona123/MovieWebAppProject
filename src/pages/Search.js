import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import "./Search.css";
import { Range } from "react-range";

//Muuttujat min ja max years
const MIN_YEAR = 1900;
const MAX_YEAR = 2024;

export default function Search() {
  const [keywords, setKeywords] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 18, name: "Drama" },
    { id: 99, name: "Documentary" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];
  const [tempSelectedGenres, setTempSelectedGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isAllGenresSelected, setIsAllGenresSelected] = useState(false);
  const [yearRange, setYearRange] = useState([MIN_YEAR, MAX_YEAR]);
  const [finalYearRange, setFinalYearRange] = useState([MIN_YEAR, MAX_YEAR]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const location = useLocation();
  const { filteredMovies } = useMovies(
    searchQuery,
    finalYearRange[0],
    finalYearRange[1],
    selectedGenres,
    selectedLanguage
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");

    if (query) {
      setKeywords(query); // Display query in the search bar
      setSearchQuery(query); // Trigger search with this query
    } else {
      setKeywords("");
      setSearchQuery("");
      setTempSelectedGenres([]);
      setSelectedGenres([]);
      setYearRange([1900, 2024]);
      setSearchQuery("");
    }
  }, [location]);

  //Handler for keywords
  const handleKeyWordsChange = (e) => {
    setKeywords(e.target.value);
  };
  //Handler for search button
  const handleSearchButtonClick = () => {
    setSearchQuery(keywords.trim() || "");
    setSelectedGenres([...tempSelectedGenres]);
    setFinalYearRange(yearRange);
  };
  //Handler for pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };
  //Handler for genres
  const handleGenreChange = (e) => {
    const genreId = parseInt(e.target.value);
    setTempSelectedGenres((prevTempGenres) => {
      if (e.target.checked) {
        return [...prevTempGenres, genreId];
      } else {
        return prevTempGenres.filter((id) => id !== genreId);
      }
    });
  };
  //Handler for all genres
  const handleAllGenresChange = (e) => {
    if (e.target.checked) {
      setTempSelectedGenres(genres.map((genre) => genre.id));
      setIsAllGenresSelected(true);
    } else {
      setTempSelectedGenres([]);
      setIsAllGenresSelected(false);
    }
  };
  //Handler for changing year
  const handleRangeChange = (values) => {
    setYearRange(values);
  };

  return (
    <div className="search-page">
      <aside className="search-filter">
        <h2>Search movies</h2>
        <div className="name-filter">
          <label htmlFor="title">Title name</label>
          <input
            type="text"
            id="keywords"
            placeholder="Movie name"
            value={keywords}
            onChange={handleKeyWordsChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div>
          <label className="genres-label">Genres</label>
          <div className="genres-container">
            <label className="genre-item">
              <input
                type="checkbox"
                value="all"
                checked={isAllGenresSelected}
                onChange={handleAllGenresChange}
              />
              All
            </label>
            {genres.map((item) => (
              <label key={item.id} className="genre-item">
                <input
                  type="checkbox"
                  value={item.id}
                  checked={tempSelectedGenres.includes(item.id)}
                  onChange={handleGenreChange}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <div className="year-filter">
          <div className="slider-container">
            <label>Release year</label>
            <div className="range-labels">
              <span>{yearRange[0]}</span> - <span>{yearRange[1]}</span>
            </div>
            {yearRange && yearRange.length === 2 && (
              <Range
                step={1}
                min={MIN_YEAR}
                max={MAX_YEAR}
                values={yearRange}
                onChange={handleRangeChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="range-track"
                    style={{
                      position: "relative",
                      height: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="range-thumb"
                    style={{
                      position: "absolute",
                      top: "0px",
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#007bff",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                  />
                )}
              />
            )}
          </div>
        </div>
        <button className="button" onClick={handleSearchButtonClick}>
          Search
        </button>
      </aside>

      <div className="search-results">
        <h3>Search Results</h3>
        {filteredMovies.length > 0 ? (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <li key={movie.id} className="movie-card">
                {movie.poster_path ? (
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </Link>
                ) : (
                  <p>No Image Available</p>
                )}
                <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                <p>Release Date: {movie.release_date}</p>
              </li>
            ))}
          </div>
        ) : (
          <p>No results found for your</p>
        )}
      </div>
    </div>
  );
}
