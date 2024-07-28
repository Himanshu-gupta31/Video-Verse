import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const corsOrigin = process.env.CORS_ORIGIN || 'https://videoverse-two.vercel.app';

const app = express();
app.use(
    cors({
        origin: corsOrigin,
        credentials: true,
    })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import videoRouter from "./routes/video.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscribeRouter from './routes/subscription.route.js';

// Route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscribe", subscribeRouter);

// default route
app.get('/', (req, res) => {
    res.send('Welcome to Video-Verse API!');
});

app.use((err, req, res, next) => {
    console.error('Error details:', err);
    console.error('Request details:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
    });
    
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ error: 'Authentication error', details: 'Invalid or missing token' });
    }
    
    if (err.message === 'Not allowed by CORS') {
      return res.status(403).json({ error: 'CORS error: Origin not allowed' });
    }
    
    res.status(err.status || 500).json({ error: 'Something went wrong!', details: err.message });
  });
  
export { app };