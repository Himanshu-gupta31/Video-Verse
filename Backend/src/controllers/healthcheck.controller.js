import { Apisuccess } from "../utils/Apisuccess";
import { asyncHandler } from "../utils/asyncHandler";
import { Apierror } from "../utils/ApiError";
const healthcheck=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new Apisuccess(200,"Health checked successfully everything seems fine!!",{}))
})
export {healthcheck}