import { insertToFavorites, deleteFromFavorites, getAllFavorites } from '../models/FavoritesModel.js'

const postAddToFavorites = async (req, res, next) => {
    try {
        const { userId, movieId, movieTitle, poster_path, genres, overview, releaseDate } = req.body
        const affectecRows = await insertToFavorites(userId, movieId, movieTitle, poster_path, genres, releaseDate, overview)

        if (affectecRows > 0){
        res.status(200).json({ message: "Movie added to favorites successfully!" })
        } else{
            res.status(400).json({error: "Movie could not be added to favorites."})
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Failed to add movie to favorites." })
    }

}

const postRemoveFromFavorite = async (req, res, next) => {

    try {
        const { userId, movieId } = req.body
        const affectedRows = await deleteFromFavorites(userId, movieId)

        if (affectedRows > 0) {
            res.status(200).json({ message: "Movie successfully removed from favorites!" });
        } else {
            res.status(400).json({ error: "Movie not found in favorites or could not be removed." });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: "Failed to remove movie from favorites." })
    }
}

const postGetFavorites = async (req, res, next) => {

    try {
        const  userId  = req.query.userId
        const result = await getAllFavorites(userId)


        if (result.rowCount > 0) {
            return res.status(200).json(result.rows);
        } else {
            res.status(404).json({ error: "Could not find favorites" });
        }
    } catch (error) {

        console.log(error.message)
        res.status(500).json({ error: "Failed to remove movie from favorites." })
    }
}

export { postAddToFavorites, postRemoveFromFavorite, postGetFavorites }