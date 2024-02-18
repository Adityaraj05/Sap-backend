import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler( async (req, res) => {

    const {Name, email, phoneNr, password } = req.body
    // console.log("email: ", email);
    if (
        [Name, email, phoneNr, password].some((field) => typeof field === 'string' && field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ Name }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with Name or email  already exists")
    }
    const user = await User.create({
        Name,
        phoneNr,
        password,
        email
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
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