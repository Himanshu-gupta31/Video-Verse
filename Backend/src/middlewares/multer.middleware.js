import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname) //jab next time kuch improvement karna hoga toh file.koi aise use karunga jisse harr baar unique name aaye jisse files kabho overwrite naa hoo
    }
  })
  
  export const upload = multer(
    { 
        storage,
     }
)