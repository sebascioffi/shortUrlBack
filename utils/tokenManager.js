import jwt from "jsonwebtoken";

export const generateToken = (uid) => {  //el payload se puede descifrar (es publica) es decir el desencriptado de el token
    const expiresIn = 60 * 15 //dura poco (15 mins) porque tendremos un refresh token que refresca este token. este token valida cualquier peticion del usuario

    try {
        const token = jwt.sign(({uid}), process.env.JWT_SECRET, {expiresIn})  
        return {token,expiresIn}

    } catch (error) {
        console.log(error);
    }

}

export const generateRefreshToken = (uid, res) => {
    const expiresIn = 60 * 60 * 24 * 30  // 30 dias
    try {
        const refreshToken = jwt.sign({uid}, process.env.JWT_REFRESH, {expiresIn})
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,     
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000), //esta en milisegundos por eso hay que multiplicarlo por mil.
            credentials: true
        })  //la guardamos en la cookie porque da lo mismo si nos lo roban o no. esto es solo para regenerar otro token.
    } catch (error) {
        console.log(error);
    }
}

export const tokenVerificationErrors = {
    "invalid signature": "La firma del JWT no es válida",
    "jwt expired": "JWT expirado",
    "invalid token": "Token no válido",
    "No Bearer": "Utiliza formato Bearer",
    "jwt malformed": "JWT formato no válido"
} 