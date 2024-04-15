import "dotenv/config"
import "./database/connectdb.js"
import express from "express"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import linkRouter from "./routes/link.route.js"
import redirectRouter from "./routes/redirect.route.js"
import cors from "cors"

const app = express()

const whiteList = [process.env.ORIGIN1] //dominios que quiero aceptar

/*
app.use(cors({
    origin: function(origin, callback){
        if (whiteList.includes(origin)){
            return callback(null, origin)
        }
        return callback("Error de CORS origin: " + origin + " No autorizado!")
    }
}))
*/
cors.SupportsCredentials = true;
app.use(cors({
    origin: function(origin, callback){
        if (whiteList.includes(origin)){
            return callback(null, origin)
        }
        return callback("Error de CORS origin: " + origin + " No autorizado!")
    },
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

// Esto es en modo de ejemplo ya que es raro que el redireccionamiento se haga desde el lado del backend (con la ruta del backend y no del frontend)
app.use("/", redirectRouter)

app.use("/api/v1/auth", authRouter)

app.use("/api/v1/links", linkRouter)

app.get("/", (req,res) => {
    res.send("Servidor andando")    
})

const PORT = process.env.PORT || 5000
app.listen(5000, () => console.log("Servidor en " + PORT + " ❤"))
