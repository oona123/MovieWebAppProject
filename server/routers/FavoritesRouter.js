import { Router } from "express";
import { postAddToFavorites, postRemoveFromFavorite, postGetFavorites } from '../controllers/FavoritesController.js'

const router = Router();

//Routes for favorite movies
router.get("/getFavorites", postGetFavorites)
router.post("/addToFavorites", postAddToFavorites)
router.delete("/removeFromFavorites",  postRemoveFromFavorite)

export default router