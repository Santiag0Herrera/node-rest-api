import express from "express";
import { movies } from "./movies.mjs"
import crypto from "node:crypto"
import { validateMovie, validatePartialMovie } from "./schemas/movies.js";

const app = express()
let URL = ''
const PORT = process.env.PORT ?? 1234
const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000'
]

app.listen(PORT, () => {
    console.log('Server up on http://localhost:' + PORT);
    URL = `http://localhost:${PORT}`
})
app.disable('x-powered-by')
app.use(express.json())

// El error de CORS no solo ocurre si se accede desde una url no determinada, sino que hay algo mas a tener en cuenta. Si queremos utilizar un metodo PUT/PATCH/DELETE debemos tener en cuenta el CORS pre-flight

const validateOrigin = (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin){ // --> !origin hace referencia a que si no se recibe un origen, esto es por que se esta haciendo desde el mimso endpoint en el que esta la api
        console.log(origin);
        res.header("Access-Control-Allow-Origin", origin)
    }
    // res.header("Access-Control-Allow-Origin", "*")
}

//CORS PRE-FLIGHT
// Se realiza una peticion previa a la demandada por el cliente, en la que se le consulta al servidor cuales son los mteodos autorizados a realizar. Es esto lo que debemos aclarar, ademas de la url a autorizar.

app.options('/movies/:movieId', (req, res) => {
    const origin = req.header('origin')

    if (ACCEPTED_ORIGINS.includes(origin) || !origin){ 
        res.header("Access-Control-Allow-Origin", origin)
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE")
    }
    res.send(200)
})

// ENDPOINTS
//GETs
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido!' })
})

app.get('/movies', (req, res) => {
    validateOrigin(req, res)
    const { genre, search } = req.query
    console.log(req.query);
    let filteredMovies = []
    if(!req.query){
        if (genre) {
            filteredMovies = movies.filter(movie => movie.genre.includes(genre))
        }
        if (search) {
            filteredMovies = filteredMovies.length > 0 ? filteredMovies.filter(movie => movie.title.includes(search)) : movies.filter(movie => movie.title.includes(search))
        }
        return res.json(filteredMovies)
    }
    return res.json(movies)
})

app.delete('/movies/:movieId', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin){ 
        res.header("Access-Control-Allow-Origin", origin)
    }

    const { movieId } = req.params
    const movieIndex = movies.findIndex(m => m.id === movieId) // --> obtenemos la posicion de la pelicula en el array
    if (movieIndex === -1){
        res.status(404).json({ message: "Movie Not Found" })
    } 
    movies.splice(movieIndex, 1) // --> eliminamos la pelicula del array
    res.status(202).json({message: "Movie deleted"})
})

app.get('/movies/:movieId', (req, res) => {
    const { movieId } = req.params
    const movie = movies.find(m => m.id == movieId)

    if (movie) res.json(movie)
    
    res.status(404).json({ error: "Not Found" })
})

// POSTs
app.post('/movies', (req, res) => {
    const result = validateMovie(req.body)
    
    if (result.error) return res.status(400).json({ error:JSON.parse(result.error.message) })

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    movies.push(newMovie)
    res.status(201).json({ message: "Movie created succesfully!", data: newMovie })
})

app.patch('/movies/:movieId', (req, res) => {
    const { movieId } = req.params // --> obtenemos el id pasado por url en la request
    const movieIndex = movies.findIndex(movie => movie.id == movieId) // --> obtenemos el index de la movie, buscandola en el array movies
    const result = validatePartialMovie(req.body) // --> validamos parcialmente el body de la request con el shcema de la movie
    
    if(!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    } // --> si hay error, devolver un 400
    
    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" })
    } // --> si no se encontro ninguna movie, entonces devoler un 400
    
    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    } // --> generamos el objeto con la version modificada

    movies[movieIndex] = updatedMovie // --> reemplazamos la movie desactualizada por la movie actualizada
    return res.status(200).json({ message: "Movie updated successfully", data: updatedMovie })
})