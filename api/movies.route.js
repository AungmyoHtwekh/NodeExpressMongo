import express from 'express'
import movieController from './movie.controller.js'
const router = express.Router() // get access to express router
router.route('/')
.get(movieController.apiGetMovies)
.post(movieController.apiAddMovie)
.put(movieController.apiUpdateMovie)
.delete(movieController.apiDeleteMovie)
router.route("/id/:id").get(movieController.apiGetMovieById)
export default router