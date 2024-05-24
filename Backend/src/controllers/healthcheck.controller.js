import { Apisuccess } from "../utils/Apisuccess.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Apierror } from "../utils/ApiError.js";
const healthcheck=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new Apisuccess(200,"Health checked successfully everything seems fine!!",{}))
})
export {healthcheck}