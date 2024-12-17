import { pool } from "../helpers/db.js"

const insertReview = async (userId, movieId, movieTitle, grade, review) => {
    console.log("user: ",userId, "movie: ", movieId, "movieTitle: ", movieTitle, "grade: ", grade, "review: ", review)
    return await pool.query(
        "INSERT INTO movie_reviews (user_id, movie_id, movie_title, grade, review, created_at) VALUES ($1, $2, $3, $4, $5, NOW())",
        [userId, movieId, movieTitle, grade, review]
    )
}

const getReviewsByMovie = async (movieId) => {
    return await pool.query(
        "SELECT mr.review, mr.grade, mr.created_at, u.email FROM movie_reviews mr JOIN users u ON mr.user_id = u.id WHERE mr.movie_id = $1",
        [movieId]
    )
}

const getAllReviews = async () => {
    return await pool.query(
        "SELECT mr.movie_id, mr.movie_Title, mr.review, mr.grade, mr.created_at, u.email FROM movie_reviews mr JOIN users u ON mr.user_id = u.id ORDER BY mr.created_at DESC"
    )
}

const getReviewsByUser = async (userId) => {
    return await pool.query(
        "SELECT mr.review, mr.grade, mr.movie_Title, mr.created_at, mr.movie_id FROM movie_reviews mr WHERE mr.user_id = $1",
        [userId]
    )
}

const deleteFromReviews = async (userId, movieId) => {
    console.log("Deleting review for userId:", userId, "movieId:", movieId); 
    return await pool.query(
        "DELETE FROM movie_reviews WHERE user_id = $1 AND movie_id = $2 RETURNING *",
        [userId, movieId]
    )
}
export { insertReview, getReviewsByMovie, getAllReviews, getReviewsByUser, deleteFromReviews }