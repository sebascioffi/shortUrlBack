import jwt from "jsonwebtoken"
import { tokenVerificationErrors } from "../utils/tokenManager.js"

export const requireToken = (req,res,next) => {
    try {
        let token = req.headers?.authorization
        if (!token) {
            throw new Error("No existe el token en el header. Usa Bearer")
        }
        // cuando se envia un token valido, el token tiene el formato bearer, por eso quiero tomar solamente el token 
        token = token.split(" ")[1] //el indice 0 dice "bearer" y el 1 es el token en si
        const {uid} = jwt.verify(token, process.env.JWT_SECRET)
        
        req.uid = uid //cualquier controlador que ocupe este middleware y que sea valido tendrá acceso a este uid

        next()

    } catch (error) {
        console.log(error.message);
             
        return res.status(401).send({error:tokenVerificationErrors[error.message]})
    }
}