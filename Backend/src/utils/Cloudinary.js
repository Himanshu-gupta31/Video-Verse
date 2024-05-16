import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
const uploadOncloudinary= async (localfilepath) => {
    try {
        if(!localfilepath)return null
        const res= await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })
        fs.unlinkSync(localfilepath)
        return res
    } catch (error) {
        fs.unlinkSync(localfilepath) //remove the locally saved temporary file as upload operation got failed
        return null
    }
}
export {uploadOncloudinary}