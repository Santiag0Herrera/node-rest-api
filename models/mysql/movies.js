import mysql from 'mysql2/promise';

const config = {
  host: "localhost",
  user: 'root',
  port: 3306,
  password: 'Alsina4496',
  database: 'moviesDB'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll({ genre, search }){
    let [movies, tableInfo] = await connection.query(`SELECT BIN_TO_UUID(movies.id) as movie_id, title, year, director, duration, poster, rate, name as genre FROM movies
    JOIN movie_genre ON BIN_TO_UUID(movie_genre.movie_id) = BIN_TO_UUID(movies.id)
    JOIN genres ON genre_id = genres.id;`)
    if(genre?.length > 0) movies = movies?.filter(m => m?.genre?.includes(genre))
    if(search?.length > 0) movies = movies?.filter(m => m?.title?.includes(search))
    return movies
  }

  static async getById(req) {
    const { movieId } = req;

    let [movies, tableInfo] = await connection.query(
      `SELECT BIN_TO_UUID(movies.id) as movie_id, title, year, director, duration, poster, rate, name as genre FROM movies
      JOIN movie_genre ON BIN_TO_UUID(movie_genre.movie_id) = BIN_TO_UUID(movies.id)
      JOIN genres ON genre_id = genres.id
      WHERE BIN_TO_UUID(movie_id) = "${movieId}";`
    );
    if(movies.length > 1){
      const genresArray = []
      movies.map(m => genresArray.push(m.genre))
      movies[0].genre = genresArray
      return movies[0]
    }
    return movies;
}

  static async deleteById({ movieId }){
    
  }

  static async updateById({ movieId, result }){
    
  }

  static async create({ result }){
    
  }
  
}