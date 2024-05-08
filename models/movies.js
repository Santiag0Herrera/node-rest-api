import { movies } from "../movies.js"
import crypto from "node:crypto"

export class MovieModel {
  static async getAll({ genre, search }){
    let filteredMovies = movies
    if (genre) {
      filteredMovies = filteredMovies.filter(movie => movie.genre.includes(genre))
    }

    if (search) {
      filteredMovies = filteredMovies.filter(movie => movie.title.includes(search))
    }

    return filteredMovies
  }

  static async getById({ movieId }){
    //conection with ddbb
    const movie = movies.find(m => m.id == movieId)
    return movie
  }

  static async deleteById({ movieId }){
    const movieIndex = movies.findIndex(movie => movie.id == movieId) 
    if (movieIndex === -1) {
      return false;
    }
    movies.splice(movieIndex, 1)
    return true;
  }

  static async updateById({ movieId, result }){
    const movieIndex = movies.findIndex(movie => movie.id == movieId)
    if (movieIndex === -1) {
      return false
    } 
    const updatedMovie = {
      ...movies[movieIndex],
      ...result.data
    }
    movies[movieIndex] = updatedMovie
    return true
  }

  static async create({ result }){
    const newMovie = {
      id: crypto.randomUUID(),
      ...result.data
    }
    movies.push(newMovie)
    return newMovie
  }
  
}