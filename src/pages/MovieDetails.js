import React, { useContext, useEffect, useState, } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieReviews, fetchMovieTrailers } from '../api/api.js';
import { UserContext } from '../context/userContext.js';
import axios from 'axios';
import ReviewModal from '../components/ReviewModal.js';
import './MovieDetails.css';

function MovieDetails() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null)
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const getMovieDetailsAndReviews = async () => {
      try {
        //Fetch movie details from api
        const details = await fetchMovieDetails(id);
        setMovie(details);

        const reviewsData = await fetchMovieReviews(id);
        setReviews(reviewsData);

        //Fetch the movie trailers from api
        const trailers = await fetchMovieTrailers(id);
        const trailer = trailers.find(video => video.type === 'Trailer');
        if (trailer) {
          setTrailerKey(trailer.key);
        }

      } catch (err) {
        setError('Failed to fetch movie details or reviews.');
      } finally {
        setLoading(false);
      }
    };

    const getUserGroups = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_URL + '/groups/getUserGroups/' + user.id)
        setGroups(response.data)

      } catch (error) {
        console.error(error)
      }
    }

    // Get users groups if logged in
    getMovieDetailsAndReviews();
    if (user.token) {
      getUserGroups()
    }

  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!movie) {
    return <p>Movie not found.</p>;
  }


  const handleAddtoFavoritesClick = async () => {
    try {
      const genreIds = movie.genres.map(genre => genre.id)
      await axios.post(process.env.REACT_APP_API_URL + '/favorites/addToFavorites', {
        userId: user.id,
        movieId: movie.id,
        movieTitle: movie.title,
        poster_path: movie.poster_path,
        genres: genreIds,
        releaseDate: movie.release_date,
        overview: movie.overview
      });
      alert('Movie added to favorites!');
    } catch (error) {
      console.error('Failed to add movie:', error);
      alert('Failed to add movie to favorites. /MD');
    }
  }


  const handleRemoveFromFavoritesClick = async () => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + '/favorites/removeFromFavorites', {
        data:
        {
          userId: user.id,
          movieId: movie.id
        }
      });
      alert('Movie removed from favorites!');
    } catch (error) {
      console.error('Failed to remove movie:', error);
      alert('Failed to remove movie from favorites. /MD');
    }
  }

  const handleAddMovieToGroupClick = async () => {

    if (!selectedGroup) {
      alert("Please select a group.");
      return;
    }
    try {

      const genreIds = movie.genres.map(genre => genre.id)
      await axios.post(process.env.REACT_APP_API_URL + '/groups/addToGroupMovies', {
        id: selectedGroup,
        movieId: movie.id,
        movieTitle: movie.title,
        poster_path: movie.poster_path,
        genres: genreIds,
        releaseDate: movie.release_date,
        overview: movie.overview
      });
      alert('Movie added to group movies!');
    } catch (error) {
      console.error('Failed to add movie to group movies:', error);
      alert('Failed to add movie to group movies');
    }
  }

  // Handler for choosing a group in the dropdown
  const handleGroupSelect = (event) => {
    setSelectedGroup(event.target.value);
  };

  //Handler for adding new review
  const handleAddReview = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  }

  return (
    <div className="movie-details-container">
      <div className="movie-header">
        <h1 className="movie-title">{movie.title}</h1>
      </div>
      <div className="movie-main-content">
        <div className="poster-and-player">
          <div className="poster-container">
            {movie.poster_path ? (
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <p className="no-image-placeholder">No image available.</p>
            )}
          </div>
          <div className="video-player">
            {trailerKey ? (
              <iframe
                width="100%"
                height="375"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title='Movie Trailer'
                allow='accelometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            ) : (
              <p>No trailer available</p>
            )}
          </div>
        </div>

        <div className="movie-details-and-actions">
          <div className="movie-details">
            <p className="movie-genres">
              <strong>Movie genres:</strong> {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
            <p className="movie-overview">
              <strong>Overview:</strong>
              <br />
              {movie.overview}
            </p>
          </div>

          <div className="movie-actions">
            <div className="group-select-container">
              <select className="group-select" onChange={handleGroupSelect}>
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.group_id} value={group.group_id}>
                    {group.group_name}
                  </option>
                ))}
              </select>
              <button
                className="add-to-group-button"
                onClick={handleAddMovieToGroupClick}>Add
              </button>
            </div>

            <button className="favorite-button" onClick={handleAddtoFavoritesClick}>
              Add to favourites
            </button>
            <button className="remove-favorite" onClick={() => handleRemoveFromFavoritesClick()}>
              Remove from favorites
            </button>
            <div>

            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-section-header">
          <h4>Reviews</h4>
          <div>
            <button
              className="write-review-button"
              onClick={() => {
                if (user?.token) {
                  setOpenReviewModal(true);
                  setErrorMessage(null);
                } else {
                  setErrorMessage('You need to be logged in to add your review.');
                }
              }}
            >
              Write a review
            </button>
          </div>
        </div>

      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <p className="review-header">
              <strong>{review.email}</strong> - <em>{new Date(review.created_at).toLocaleDateString()}</em>
            </p>
            <p>Grade: {review.grade}</p>
            <p>{review.review}</p>
          </div>
        ))}
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {openReviewModal && (
        <ReviewModal
          closeReviewModal={setOpenReviewModal}
          movieId={movie.id}
          addNewReview={handleAddReview}
        />
      )}
    </div>
    </div>
  );
}

export default MovieDetails;