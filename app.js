import express from "express";
import { moviesRouter } from "./routes/movies.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { authMiddleware } from "./middlewares/auth.js";
import pc from "picocolors";

const app = express()
let URL = ''
const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
    console.log('Server up on http://localhost:' + PORT);
    URL = `http://localhost:${PORT}`
})
app.disable('x-powered-by')
app.use(express.json())
app.use(corsMiddleware())
app.use(authMiddleware)
app.use((req, res, next) => {
  console.log(`${pc.blue(req.method)} --> ${pc.yellow(req.originalUrl)}`)
  next()
})

// El error de CORS no solo ocurre si se accede desde una url no determinada, sino que hay algo mas a tener en cuenta. Si queremos utilizar un metodo PUT/PATCH/DELETE debemos tener en cuenta el CORS pre-flight
//CORS PRE-FLIGHT
// Se realiza una peticion previa a la demandada por el cliente, en la que se le consulta al servidor cuales son los mteodos autorizados a realizar. Es esto lo que debemos aclarar, ademas de la url a autorizar.

app.use('/movies', moviesRouter)