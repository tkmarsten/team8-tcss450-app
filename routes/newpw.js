const express = require('express')

var router = express.Router()
//Access the connection to Heroku Database
const pool = require('../utilities').pool

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

const generateHash = require('../utilities').generateHash
const generateSalt = require('../utilities').generateSalt

const sendEmail = require('../utilities').sendEmail

router.get("/", (request, response) => {
    if (isStringProvided(request.query.e1)
        && isStringProvided(request.query.e2)
        && isStringProvided(request.query.e3)) {
        // Reconstitute email address from link parameters TODO decode
        let email = request.query.e1 + "@" + request.query.e2 + "." + request.query.e3
        
        // Send new password to user.
        let password = generatePassword(8) // Default is a randomly generated password.
        if (isStringProvided(request.body.password)){
            password = request.body.password
        }

        let salt = generateSalt(32)
        let salted_hash = generateHash(password, salt)
        
        let theQuery = "UPDATE Members SET Password = $1, Salt = $2 WHERE Email = $3"
        let values = [salted_hash, salt, email]

        pool.query(theQuery, values)
            .then(result => {
                // Inform user of new password.
                sendEmail(process.env.SENDER_EMAIL, email,
                    "New Password", "Your new password is: " + password)
                
                //Success message
                response.status(201).send({
                    success: true,
                    message: "success, please check your email for your new password."
                })
            })
            .catch((error) => {
                //log the error
                console.log(error)
                // if (error.constraint == "members_username_key") {
                //     response.status(400).send({
                //         message: "Username exists"
                //     })
                // }
            })
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
})

/**
 * Helper function modified from stack overflow posting.
 * StackOverflow: https://stackoverflow.com/questions/1497481/javascript-password-generator
 */
 function generatePassword(length) {
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports = router