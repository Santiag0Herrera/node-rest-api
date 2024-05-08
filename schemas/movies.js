import zod from 'zod'

const movieSchema = zod.object({
    title: zod.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is require'
    }),
    year: zod.number().int().positive().max(2024),
    director: zod.string({
        invalid_type_error: 'Movie director must be a string',
        required_error: 'Movie director is require'
    }),
    duration: zod.number().int().positive().max(1000),
    rate: zod.number().positive().max(10),
    poster: zod.string().url({
        message: 'Movie poster must be a valid url'
    }),
    genre: zod.array(zod.enum(["Drama", "Action", "Crime", "Adventure", "Sci-Fi", "Romance", "Animation", "Biography", "Fantasy", "Terror"]))
})

export function validateMovie(object) {
    return movieSchema.safeParse(object)
}

export function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object) // --> el partial hace que si una propiedad no esta, no pasa nada, pero para aquellas que si esten, las valida como debe ser.
}