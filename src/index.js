import http from 'http';
import express from 'express';
import morgan from 'morgan';
import "./config/mongo_db/mongo.js"; // initiate mongo db
import authRoute from "./routes/auth.js";
import conversationRoute from "./routes/conversation.js"
import { decode } from './middlewares/jwt.js'

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Routes */
app.use("/auth", authRoute);
app.use("/conversation", decode, conversationRoute);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 6070;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));