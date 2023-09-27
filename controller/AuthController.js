import { OAuth2Client } from "google-auth-library";
import { genJwtSign } from '../middleware/jsonwebtoken.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const googleLogin = async (req, res, next) => {
    try {
        const data = await client.verifyIdToken({
            idToken: req.body.token
        })
        const __data = data.getPayload()
        const token = genJwtSign(__data.email)
        res
            .cookie('access_token', token, {
                httpOnly: true,
                maxAge: 365 * 24 * 60 * 60 * 1000
            })
            .status(200)
            .json(__data)
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json({ message: 'Logged out' })
    } catch (error) {
        next(error)
    }

}