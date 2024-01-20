const z = require('zod');

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is require'
    }),
    year: z.number().int().positive().max(2024),
    director: z.string({
        invalid_type_error: 'Movie director must be a string',
        required_error: 'Movie director is require'
    }),
    duration: z.number().int().positive().max(1000),
    rate: z.number().positive().max(10),
    poster: z.string().url({
        message: 'Movie poster must be a valid url'
    }),
    genre: z.array(z.enum(["Drama", "Action", "Crime", "Adventure", "Sci-Fi", "Romance", "Animation", "Biography", "Fantasy", "Terror"]))
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object) // --> el partial hace que si una propiedad no esta, no pasa nada, pero para aquellas que si esten, las valida como debe ser.
}

module.exports = { validateMovie, validatePartialMovie }