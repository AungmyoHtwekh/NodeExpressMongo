import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import movieDAO from './dao/moviesDAO.js'

async function main() {
    dotenv.config()
    const client = new mongodb.MongoClient(
        process.env.DB_URI
    )
    const port = process.env.PORT || 8000
    try {
        // Connect to the MongoDB cluster
        await client.connect()
        await movieDAO.injectDB(client)
        app.listen(port, () => {
            console.log('server is running on port:' + port);
        })
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
}
main().catch(console.error);