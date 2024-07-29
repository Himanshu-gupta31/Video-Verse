import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://videoverse-two.vercel.app'
];
console.log("")
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
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
import subscribeRouter from "./routes/subscription.route.js";

// Route declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscribe", subscribeRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Video-Verse API!");
});


export { app };
