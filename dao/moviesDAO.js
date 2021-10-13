import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let movies
export default class MoviesDAO {
    static async injectDB(conn) {
        if (movies) {
            return
        } try {
            movies = await conn.db(process.env.DB_NAME)
                .collection('movie')
        } catch (e) {
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }

    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}) {
        let query
        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters['title'] } }
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } }
            }
        }
        let cursor
        try {
            cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return { moviesList, totalNumMovies }
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }
    }

    static async getMovieById(id) {
        try {
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                }
                // for relationship document, use lookup
                // },
                // {
                //     $lookup:
                //     {
                //         from: 'reviews',
                //         localField: '_id',
                //         foreignField: 'movie_id',
                //         as: 'reviews',
                //     }
                // }
            ]).next()
        }
        catch (e) {
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }

    static async addApiMovie(req){
        try{
            return await movies.insertOne(req.body);
        }
        catch(e){
            console.log(`Unable to add movie, ${e}`)
            return e
        }

    }

    static async updateApiMovie(req){
        try{
            const movieDoc = {
                title: req.body.title,
                rating: req.body.rating,
                releaseDate: req.body.releaseDate
            }
            return await movies.updateOne({_id: ObjectId(req.body.id)},{$set: movieDoc});
        }
        catch(e){
            console.log(`Unable to update movie, ${e}`)
            return e
        }

    }

    static async deleteApiMovie(req){
        try{
            const movieDoc = {
                _id: ObjectId(req.body.id)
            }
            return await movies.deleteOne(movieDoc);
        }
        catch(e){
            console.log(`Unable to delete movie, ${e}`)
            return e
        }

    }
}