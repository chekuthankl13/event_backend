import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"

export const tokenValidation = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1]
        

        jwt.verify(token, process.env.SECERT_KEY, (err, decoded) => {
            if (err) {
                res.status(500)
                throw new Error(err.message)
            } else {
                req.userData = decoded
                next()
            }
        }

        );

    } else {
        res.status(401)
        throw new Error("Bearer token is required !!")
    }
})