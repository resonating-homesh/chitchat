const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
    let token;

    //our authorization will be consiting of Bearer+token id
    //we will be saving our token no in token by using the below code

    if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; //we have saved ou token no. inside this token constant 
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //since we are generating our token using id and JWT_SECRET, now we are getting back our id by using token and JWT_SECRET and storing it in a variable
            req.user = await User.findById(decoded.id).select("-password");
            // console.log(req.user);
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("u are not authorized, no token");
    }
});

module.exports = { protect };