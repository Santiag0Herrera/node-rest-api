import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const moviesRouter = Router()
moviesRouter.options('/:movieId', MovieController.getOptions)
moviesRouter.get('/', MovieController.getAll)
moviesRouter.get('/:movieId', MovieController.getById)
moviesRouter.delete('/:movieId', MovieController.delete)
moviesRouter.patch('/:movieId', MovieController.update)
moviesRouter.post('/', MovieController.create)
