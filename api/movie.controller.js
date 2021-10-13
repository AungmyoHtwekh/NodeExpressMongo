import movieDAO from '../dao/moviesDAO.js'
export default class MoviesController {
    static async apiGetMovies(req, res, next) {
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0
        let filters = {}
        if (req.query.rated) {
            filters.rated = req.query.rated
        } else if (req.query.title) {
            filters.title = req.query.title
        }
        const { moviesList, totalNumMovies } = await movieDAO.getMovies({
            filters, page,
            moviesPerPage
        })
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }
        res.json(response);
    }

    static async apiGetMovieById(req, res, next) {
        try {
            let id = req.params.id || {}
            let movie = await movieDAO.getMovieById(id)
            if (!movie) {
                res.status(404).json({ error: "not found" })
                return
            } res.json(movie)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiAddMovie(req, res, next) {
        try {
            let movie = await movieDAO.addApiMovie(req)
            console.log('add', movie)
            if(!movie.insertedId){
                throw new error("unable to add movie.")
            }
            res.json({status: "success"})
        }catch (e){
            console.log(`api, ${e}`)
            res.status(500).json({error : e})
        }
    }

    static async apiUpdateMovie(req, res, next) {
        try {
            let movie = await movieDAO.updateApiMovie(req)
            console.log('add', movie)
            if(movie.modifiedCount === 0){
                throw new error("unable to update movie.")
            }
            res.status(200).json({status: "resource updated successfully"})
        }catch (e){
            console.log(`api, ${e}`)
            res.status(500).json({error : e})
        }
    }

    static async apiDeleteMovie(req, res, next) {
        try {
            let movie = await movieDAO.deleteApiMovie(req)
            console.log('add', movie)
            if(!movie.deletedCount){
                throw new error("unable to delete movie.")
            }
            res.status(200).json({status: "resource deleted successfully"})
        }catch (e){
            console.log(`api, ${e}`)
            res.status(500).json({error : e})
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            let propertyTypes = await movieDAO.getRatings()
            res.json(propertyTypes)
        } catch (e) {
            console.log(`api,${e}`)
            res.status(500).json({ error: e })
        }
    }
}
