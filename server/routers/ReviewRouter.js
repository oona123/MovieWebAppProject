import { Router } from "express";
import { postAddReview, getMovieReviews, getAllMovieReviews, getUserReviews, postRemoveFromReviews } from '../controllers/ReviewController.js'

const router = Router();

//Route to add a review
router.post("/add", postAddReview)

//Route to get reviews for a specific movie
router.get("/:movieId", getMovieReviews)

//Route to get all reviews
router.get("/", getAllMovieReviews)

//Router to get reviews for a logged in user
router.get("/user/:userId", getUserReviews)

//Router to remove reviews
router.delete("/removeFromReviews", postRemoveFromReviews)


export default router