import { User } from "../models/User.js"
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js"

export const register =  async(req,res) => {
    const {email,password} = req.body
    try {
        //alternativa 2 para verificar si ya existe el usuario en la base de datos buscando por email
        let user = await User.findOne({email})
        if (user) throw {code:11000}

        user = new User({email,password})
        await user.save()

        //generar el token jwt
        const {token, expiresIn} = generateToken(user.id)
        generateRefreshToken(user.id, res)

        return res.status(201).json({token,expiresIn}) //el 201 quiere decir que se creo una instancia nueva en la base de datos
    } catch (error) {
        console.log(error); 
        //alternativa por defecto mongoose
        if (error.code === 11000){ //ese numero indica que en la base de datos ya está ese email
            return res.status(400).json({error: "Ya existe este usuario"})        
        }

        return res.status(500).json({error: "Error de servidor"})
    }
}

export const login = async(req,res) => {
    try {
        const {email,password} = req.body
        let user = await User.findOne({email})
        if (!user) return res.status(403).json({error:"No existe este usuario"})
        const respuestaPassword = await user.comparePassword(password)
        if (!respuestaPassword){
            return res.status(403).json({error:"Contraseña incorrecta"})     
        }

        const {token, expiresIn} = generateToken(user._id)  //mando solo el id porque esta informacion es publica cualquiera puede acceder a ella
        
        generateRefreshToken(user.id, res)

        return res.json({token, expiresIn})   
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Error de servidor"})
    }
}

export const infoUser = async(req,res) => {
    try {
        const user = await User.findById(req.uid).lean() // con el lean el objeto es simple (mas rapido) y no vienen todas las cosas de mongoose
        return res.json({email:user.email, uid:user._id})
    } catch (error) {
        return res.status(500).json({error:"error de servidor"})
    }
}

export const refreshToken = (req,res) => {
    try {
        const {token, expiresIn} = generateToken(req.uid)
        return res.json({token,expiresIn})

        /*
        entonces: 
        hacemos el login con las credenciales correctas. 
        nos devuelve un token de seguridad. es el que hace las peticiones. todo se valida a traves de este token
        no se guarda en ninguna aparte excepto en mi memoria ram.
        lo que si se almacena es el refresh token
        ese se guarda en una cookie segura (no puede ser accedida desde javascript)
        cuando quiero acceder en el frontend a una ruta protegida, lo que hago es primero, como no tengo el token, 
        para solicitar un nuevo token utilizo el refresh token, el cual verifica que sea verdadero y me devuelve un token exitoso.
        con ese token hago la peticion a la ruta protegida. 
        esto es seguro
        un malicioso podria llamar al refresh pero no va a tener la rta porque estará bloqueado por cors. 
        */

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Error de servidor"})
    }

}

export const logout = (req,res) => {
    res.clearCookie("refreshToken")
    res.json({ok:true})
}