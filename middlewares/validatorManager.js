import { body, param } from "express-validator"
import { validationResultExpress } from "./validationResultExpress.js"
import axios from "axios"

export const bodyRegisterValidator = [
    body("email", "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "Mínimo 6 caracteres").trim().isLength({min:6}),
    body("password", "Formato de password incorrecta").custom((value, {req}) => {
        if (value !== req.body.repassword){
            throw new Error("No coinciden las contraseñas") // en realidad la repassword se puede validar en el frontend mejor
        }
        return value
    }),
    validationResultExpress
]

export const bodyLoginValidator = [
    body("email", "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "Mínimo 6 caracteres").trim().isLength({min:6}),
    validationResultExpress
    ]

export const paramLinkValidator = [
    param("id", "Formato no valido (expressValidator)")
    .trim()
    .notEmpty()
    .escape()
    , validationResultExpress
]

export const bodyLinkValidator = [
    body("longLink", "formato link incorrecto")
    .trim()
    .notEmpty()
    .custom(async value => {
        try {

            if (!value.startsWith("https://")){
                value = "https://" + value
            }


            await axios.get(value)
            return value
        } catch (error) {
            //console.log(error);
            throw new Error("not found longlink 404")
        }
    })
    ,validationResultExpress
]