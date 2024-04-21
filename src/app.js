import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb"}))
app.use(express.static("public")) //static kya karta hai dekhna  hai
app.use(cookieParser())
export {app}