import { createServer } from 'http'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io'
import { connectMongoDB } from './database/mongodb.js';
import EmailRouter from './router/EmailRouter.js'
import { googleLogin, logout } from './controller/AuthController.js';
import { verifyToken } from './middleware/jsonwebtoken.js';

dotenv.config()
const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:8080"
    }
})
/** MIDDLE WARE */
app.use(cors({
    credentials: true, /** FOR COOKIE ? */
    origin: 'http://localhost:8080'
}))
app.use(cookieParser())
app.use(express.json())

/** CONNECT TO MONGODB */
connectMongoDB()

/** SOCKET.IO */
let activeUsers = []
io.on("connection", (socket) => {
    socket.on('USER_ONLINE', (emailAddress) => {
        console.log(emailAddress, ' IS ONLINE')
        if (!activeUsers.some(user => user.emailAddress === emailAddress)) {
            activeUsers.push({
                emailAddress: emailAddress,
                socketId: socket.id
            })
        }
    })

    socket.on('SEND_EMAIL', (data) => {
        const { toEmail } = data
        const user = activeUsers.find(user => user.emailAddress === toEmail)
        console.log({ NEW_EMAIL: data })
        if (user) {
            io.to(user.socketId).emit('RECEIVE_EMAIL', data)
        }
    })

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
        console.log('DISCONNECTED')
    })
});


/** LOGIN WHITH GOOGLE */
app.post('/api/google-login', googleLogin)

/** LOGOUT */
app.get('/api/logout', logout)

/** REQUIRE LOGIN */
app.use(verifyToken)

/** API ROUTES */
app.use('/email', EmailRouter)

/** HANDELER ERROR */
app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || 'Something went wrong!'

    return res.status(status).json({
        success: false,
        message: message
    })
})



/** SERVER START */
const PORT = process.env.PORT || 4001
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));