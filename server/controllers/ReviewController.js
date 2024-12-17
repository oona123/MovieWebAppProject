import { insertReview, getReviewsByMovie, getAllReviews, getReviewsByUser, deleteFromReviews } from '../models/ReviewModel.js'

//Add new review
const postAddReview = async (req, res, next) => {
    try {
        const { userId, movieId, movieTitle, grade, review } = req.body

        //Make sure grade and review are provided
        if (!grade || !review){
            return res.status(400).json({ error: "Grade and review are required."})
        }
        //Call model function to insert the review
        await insertReview(userId, movieId, movieTitle, grade, review)
        res.status(201).json({ message: "Review added successfully!"})

    } catch (error){
        console.error(error.message)
        res.status(500).json({ error: "Failed to add review."})
    }
}

//Get reviews for a specific movie
const getMovieReviews = async (req, res, next) => {
    try {
        const { movieId } = req.params

        //Call model function to retrieve reviews
        const reviews = await getReviewsByMovie(movieId)
        res.status(200).json(reviews.rows)
    } catch (error){
        console.error(error.message)
        res.status(500).json({ error: "Failed to retrieve reviews."})
    }
}

//Get all reviews from the database
const getAllMovieReviews = async (req, res, next) => {
    try {
        //Call the model function to retrieve all reviews
        const reviews = await getAllReviews()
        res.status(200).json(reviews.rows)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Failed to retrieve all reviews."})
    }
}

//Get reviews by user id
const getUserReviews = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const reviews = await getReviewsByUser(userId)
        res.status(200).json(reviews.rows)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Failed to retrieve user reviews."})
    }
}

const postRemoveFromReviews = async (req, res, next) => {
    try {
        const { userId, movieId } = req.body
        const reviews = await deleteFromReviews(userId, movieId)

        if (reviews.rowCount > 0) {
            res.status(200).json({ message: "Review succesfully removed!"})
        } else {
            res.status(400).json({ error: "Review could not be removed."})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Failed to remove review."})
    }
}

export { postAddReview, getMovieReviews, getAllMovieReviews, getUserReviews, postRemoveFromReviews }