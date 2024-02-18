import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: Name, email
 
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
   


    const {Name, email, phoneNr, password } = req.body
    console.log("email: ", email);

    if (
        [Name, email, phoneNr, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ Name }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with Name or email  already exists")
    }
    const user = await User.create({
        Name,
        email, 
        phoneNr,
        password
    })

    const createdUser = await User.findById(User._id).select(
        " password "
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )


export {
    registerUser,
}