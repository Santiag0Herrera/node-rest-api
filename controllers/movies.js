import { MovieModel } from "../models/mysql/movies.js"
import { validateMovie } from "../schemas/movies.js"
import { validatePartialMovie } from "../schemas/movies.js"

export class MovieController {

  static async getOptions(req, res){
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      res.header("Access-Control-Allow-Origin", origin)
      res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE")
    }
    res.send(200)
  }

  static async getAll(req, res){ // --> cuando le pegue a la base de 'movies'
    const { genre, search } = req.query
    const movies = await MovieModel.getAll({ genre, search })
    if(movies.length > 0){
      res.json(movies)
    } else {
      res.status(500).json("Internal Server Error")
    }
  }

  static async getById(req, res){
    const { movieId } = req.params
    const movie = await MovieModel.getById({ movieId })
    if (movie) {
      res.json(movie)
    } else {
      res.status(404).json("Movie not Found - 404")
    }
  }

  static async delete(req, res){
    const { movieId } = req.params
    const movieDelete = await MovieModel.deleteById({ movieId })
    if (movieDelete){
      res.json({ message: "Movie Deleted" })
    } else {
      res.status(404).json({ message: "Movie Not Found - 404" })
    }
  }

  static async update(req, res){
    const { movieId } = req.params
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const movieUpdate = await MovieModel.updateById({ movieId, result })
    if (!movieUpdate) {
      return res.status(404).json({ message: "Movie not found" })
    }
    return res.status(200).json({ message: "Movie updated successfully" })
  }

  static async create(req, res){
    const result = validateMovie(req.body)
  
    if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
  
    const newMovie = await MovieModel.create({ result })
  
    res.status(201).json({ message: "Movie created succesfully!", data: newMovie })
  }

}