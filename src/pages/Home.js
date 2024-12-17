import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Slider from 'react-slick';
import { Link } from 'react-router-dom'

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const listType = 'ComingSoon';
        const area = 'ALL';
        const includeVideos = 'true';
        const includeLinks = 'false';
        const includeGallery = 'false';
        const includePictures = 'false';

        const url = `https://www.finnkino.fi/xml/Events?listType=${listType}&area=${area}&includeVideos=${includeVideos}&includeLinks=${includeLinks}&includeGallery=${includeGallery}&includePictures=${includePictures}`;

        const response = await axios.get(url);

        if (response.status === 200) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data, "text/xml");

          const events = xmlDoc.getElementsByTagName('Event');

          const eventDetails = [];
          for (let i = 0; i < events.length; i++) {
            eventDetails.push({
              "title": events[i].getElementsByTagName('Title')[0].textContent,
              "releaseDate": events[i].getElementsByTagName('dtLocalRelease')[0].textContent,
              "image": events[i].getElementsByTagName('EventMediumImagePortrait')[0].textContent,
            });
          }

          // Filter and sort the events to get upcoming events
          const upcomingEvents = eventDetails
            .filter(event => new Date(event.releaseDate) > new Date())
            .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

          setEvents(upcomingEvents);
        }
      } catch (error) {
        setError('Error fetching event data');
      } finally {
        setLoading(false);
      }
    };

    // Fetch Reviews
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/`);

        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    fetchEvents();
    fetchReviews(); // Fetch reviews as well

  }, []); // Empty dependency array to run only once after the component mounts

  const NextArrowEvents = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "px" }}
        onClick={onClick}
      />
    );
  };

  const PrevArrowEvents = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "px", zIndex: "1" }}
        onClick={onClick}
      />
    );
  };
  const NextArrowReview = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "px", color: "blue" }}
        onClick={onClick}
      />
    );
  };

  const PrevArrowReview = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "px", zIndex: "1", color: "blue" }}
        onClick={onClick}
      />
    );
  };

  const sliderSettingsEvents = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    nextArrow: <NextArrowEvents />,
    prevArrow: <PrevArrowEvents />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderSettingsReviews = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    nextArrow: <NextArrowReview />,
    prevArrow: <PrevArrowReview />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  

  return (
    <div id="home-container">
      <div>
        <h3>Soon in theatres</h3>
        <Slider {...sliderSettingsEvents}>
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="event-card">
                {event.image && (
                  <img src={event.image} alt={event.title} className="event-image" />
                )}
                <h6>{event.title}</h6>
                <p>Release Date: {new Date(event.releaseDate).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No events available</p>
          )}
        </Slider>
      </div>

      <div>
        <h3 className='review-title'>Latest Reviews</h3>
        <Slider {...sliderSettingsReviews}>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="review-card">
                <h6>
                  {/*Make movie title a clickable link*/}
                  <Link to={`/movie/${review.movie_id}`} className='review-movie-link'>
                      {review.movie_title}
                  </Link>
                </h6>
                <p>
                  <strong>Reviewer:</strong><br/> {review.email}
                </p>
                <p>
                  <strong>Date:</strong><br/> {new Date(review.created_at).toLocaleString()}
                </p>
                <p>
                  <strong>Grade:</strong> {review.grade}
                </p>
                <p>
                  <strong>Review:</strong><br/> {review.review}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </Slider>
      </div>
    </div>
  );
}
