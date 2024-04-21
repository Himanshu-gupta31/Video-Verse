import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js"
dotenv.config({
    path:'./env'
})
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR",error);
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Mongo DB connnection failed!!!",error)

})

/*
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    } catch (error) {
        console.log("Error:",error)
        throw error
    }
})()
*/