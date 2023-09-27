import jwt from 'jsonwebtoken'
import { createError } from './../error.js';

export const genJwtSign = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        // expiresIn: 3 * 24 * 60 * 60
    })
}

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return next(createError(401, 'NOT_AUTHENTICATED'))
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return next(createError(403, 'TOKEN_IS_NOT_VALID'))
        }
        req.email = decodedToken.email
        next()
    })
}