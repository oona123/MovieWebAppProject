import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import { fetchMovieDetails } from '../api/api.js';
import './ReviewModal.css';

export default function ReviewModal({ closeReviewModal, movieId, addNewReview }) {
  const { user } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [movie, setMovie] = useState(null);
    
  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        const details = await fetchMovieDetails(movieId)
          setMovie(details)
      } catch (err) {
          setErrorMessage('Failed to fetch movie details')
      }
    };
      getMovieDetails()

  }, [movieId]);
  

  //Function to handle adding review
  const handleAddReview = async () => {
    if (!user?.token) {
      setErrorMessage('You need to be logged in to add your review.')
      return
    }
    try {
      // Send review data to the backend
      const response = await axios.post(process.env.REACT_APP_API_URL + '/reviews/add', {
        userId: user.id,
        movieId,
        movieTitle: movie.title,
        grade: rating,
        review: reviewText,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      })

        //Add new review to the parent side
        addNewReview(response.data)

        //Reset modal inputs ad close modal
            setReviewText('');
            setRating(0);
            closeReviewModal(false)
            alert('Review added succesfully!');
    } catch (error) {
        console.error('Failed to add review: ', error);
        alert('Failed to add review.');
      }
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-form'>
        <h3>Add Review</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label>
          Rating (1-5):
          <input
            type='number'
            min='1'
            max='5'
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </label>
        <br />
        <label>
          Review:
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </label>
        <br />
        <div className='button-container'>
          <button className='submit-button' onClick={() => handleAddReview(movieId)}>
            Submit Review
          </button>
          <button
            className='cancel-button'
            onClick={() => closeReviewModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
