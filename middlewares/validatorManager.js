import { body, param } from "express-validator"
import { validationResultExpress } from "./validationResultExpress.js"
import isUrl from 'is-url';

export const bodyRegisterValidator = [
    body("email", "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "La contraseña debe tener mínimo 6 caracteres").trim().isLength({min:6}),
    validationResultExpress
]

export const bodyLoginValidator = [
    body("email", "Formato de email incorrecto").trim().isEmail().normalizeEmail(),
    body("password", "La contraseña debe tener mínimo 6 caracteres").trim().isLength({min:6}),
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
    body("longLink", "El formato del link es incorrecto")
    .trim()
    .notEmpty()
    .custom(async value => {
        try {
            let newValue = value; // Crear una nueva variable para almacenar el valor modificado
    
            if (!newValue.startsWith("https://")) {
                newValue = `https://${newValue}`; // Asignar el valor modificado a la nueva variable
            }
    
            const urlValida = isUrl(newValue);
    
            if (urlValida) {
                return newValue;
            } else {
                throw new Error("El link es inválido");
            }
        } catch (error) {
            console.log(error);
            throw new Error("El link es inválido");
        }
    })
    ,validationResultExpress
]