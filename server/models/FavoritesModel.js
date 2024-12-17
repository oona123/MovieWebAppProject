import { pool } from "../helpers/db.js"

// Models for favorites

// Add to favorites
const insertToFavorites = async (userId, movieId, movieTitle, poster_path, genres, releaseDate, overview) => {

    const result =  await pool.query(
        
        "INSERT INTO favorite_movies (user_id, movie_id, movie_title, poster_path, genres, release_date, overview) VALUES ($1 , $2, $3, $4, $5, $6, $7) RETURNING *",
        [userId, movieId, movieTitle, poster_path, genres, releaseDate, overview]
    )

    return result.rowCount
}

// Delete from favorites
const deleteFromFavorites = async (userId, movieId) => {
   
    const result =  await pool.query(

        "DELETE FROM favorite_movies WHERE user_id = $1 AND movie_id = $2 RETURNING *" ,
        [userId, movieId]
    )

    return result.rowCount
}

// Get all favorites
const getAllFavorites = async (userId) => {

    return await pool.query("SELECT * from favorite_movies WHERE user_id = $1" ,
        [userId]
    )
}

export { insertToFavorites , deleteFromFavorites, getAllFavorites }
