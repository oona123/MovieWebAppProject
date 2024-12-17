import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/useUser";
import "./Profile.css";
import { Link } from "react-router-dom";

const url = "http://localhost:3001";

export default function Profile() {
  const { user, logOut } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    // Check if the user is logged in and has a valid token
    if (user.token) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );
          setProfileData(response.data); // Set the user data
          fetchFavorites();
          fetchUserReviews();
          fetchUserGroups();
        } catch (err) {
          setError("Failed to fetch profile data.");
          console.error(err);
        }
      };

      fetchProfile();
    } else {
      setError("You need to log in to view your profile.");
    }
  }, [user.token]);

  // Fetch user's groups
  const fetchUserGroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/groups/getUserGroups/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setUserGroups(response.data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
      setUserGroups([]);
    }
  };

  // Delete account
  const handleDeleteAccount = async (id) => {
    console.log(process.env.REACT_APP_API_URL + "/user/delete/");
    try {
      await axios.delete(process.env.REACT_APP_API_URL + "/user/delete/", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data: {
          id: id,
        },
      });
      logOut();
      alert("Account deleted!");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account.");
    }
  };

  if (error) return <div>{error}</div>;

  // Fetch favorite movies
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/favorites/getFavorites`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          params: {
            userId: user.id,
          },
        }
      );
      console.log("fetchFavorites data", response.data);
      setFavorites(response.data);
      console.log(favorites);
    } catch (error) {
      if (error.status === 404) {
        setFavorites([]);
        console.log("No favorites found");
      }
      console.log("error ", error.status);
    }
  };

  // Delete a favorite movie
  const handleRemoveFromFavoritesClick = async (movie_id) => {
    console.log(favorites);
    try {
      await axios.delete(
        process.env.REACT_APP_API_URL + "/favorites/removeFromFavorites",
        {
          data: {
            userId: user.id,
            movieId: movie_id,
          },
        }
      );
      fetchFavorites();
      alert("Movie removed from favorites!");
    } catch (error) {
      console.error("Failed to remove movie:", error.status);
      alert("Failed to remove movie from favorites. /MD");
    }
  };

  // Handler for sharing favorites
  const handleShareFavorites = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/favorites/createShareableList`, //Share favorites endpoint
        {
          userId: user.id, //Include user ID
          favorites, //Include current favorites
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, //Send token for authorization
          },
        }
      );

      if (response.data.shareId) {
        //Generate the shareable link using the shareId
        const link = `${window.location.origin}/favorites/${response.data.shareId}`;
        setShareLink(link); //Store the generated link in state
        alert("Share link created succesfully!");
      }
    } catch (error) {
      console.error("Failed to create shareable list: ", error);
      alert("Failed to create shareable list."); //Notify of failure
    }
  };

  // Fetch users reviews
  console.log(user.id);
  const fetchUserReviews = async () => {
    console.log("fetchUserReviews called");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/reviews/user/${user.id}`, // Include userId in the path
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Authorization header (optional if not required by backend)
          },
        }
      );
      console.log("User Reviews Response: ", response.data); // Log the fetched data
      setUserReviews(response.data); // Store the fetched reviews in state
    } catch (error) {
      console.error("Error fetching user reviews:", error);
    }
  };

  const handlerRemoveFromReviews = async (movie_id) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL + "/reviews/removeFromReviews",
        {
          data: {
            userId: user.id,
            movieId: movie_id,
          },
        }
      );
      if (response.status === 200) {
        fetchUserReviews();
        alert("Review removed!");
      }
    } catch (error) {
      console.error("Failed to remove review", error);
      alert("Failed to remove review.");
    }
  };

  return (
    /* Displays user information */
    <div className="profile">
      <div className="profile-info">
        {profileData && (
          <>
            <img src="/images/pfp.png" alt="Profile picture" />
            <div className="profile-details">
              <h2>{profileData.username}</h2>
              <p>{profileData.email}</p>
              <p>{profileData.first_name} {profileData.last_name}</p>
            </div>
          </>
        )}
      </div>

      {/* Displays user's groups */}
      <h3>Your Groups</h3>
      <div className="user-groups">
        <ul>
          {userGroups.map((group) => (
            <li key={group.id}>
              <Link
                to={{
                  pathname: `/group/${group.group_id}`,
                  state: { userGroups: group },
                }}
              >
                {group.group_name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <h3>Favourite movies</h3>
      {/* Displays user's favorite movies */}
      <div className="favorite-movies-grid">
        {favorites.map((movie) => (
          <li key={movie.movie_id} className="favorite-movie-card">
            {movie.poster_path ? (
              <Link to={`/movie/${movie.movie_id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              </Link>
            ) : (
              <p>No Image Available</p>
            )}
            <Link to={`/movie/${movie.movie_id}`}>{movie.movie_title}</Link>
            <button className="remove-favorite-btn" onClick={() => handleRemoveFromFavoritesClick(movie.movie_id)}>
              Remove from favorites
            </button>
          </li>
        ))}
      </div>

      {/* Display user's reviews */}
      <h3>Your Reviews</h3>
      <div className="user-reviews-grid">
        {userReviews.length > 0 ? (
          userReviews.map((review) => (
            <div key={review.movie_id} className="user-reviews-card">
              <Link to={`/movie/${review.movie_id}`} className="reviews-movie-link">
                {review.movie_title}
              </Link>
              <div className="review-details">
              <p className="review-item">
                <strong>Review:</strong> {review.review}
              </p>
              <p className="review-item">
                <strong>Grade:</strong> {review.grade}
              </p>
              <p className="review-item">
                <strong>Date:</strong> {new Date(review.created_at).toLocaleString()}
              </p>
              <button className="remove-review-btn" onClick={() => handlerRemoveFromReviews(review.movie_id)}>
                Remove review
              </button>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      <button
        className="delete-account-btn"
        onClick={() => setIsModalOpen(true)} // Open modal
      >
        Delete account
      </button>

      {isModalOpen && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h3>Confirm Account Deletion</h3>
            <p>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                onClick={() => {
                  handleDeleteAccount(user.id);
                  setIsModalOpen(false); // Close modal
                }}
              >
                Confirm
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
