// TODO accepts JWT token in URL as verification.
//express is the framework we're going to use to handle requests
const express = require('express')
//Access the connection to Heroku Database
const pool = require('../utilities').pool

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

const sendEmail = require('../utilities').sendEmail

//retrieve the router object from express
var router = express.Router()

router.get("/", (request, response) => {
    if (isStringProvided(request.query.e1)
        && isStringProvided(request.query.e2)
        && isStringProvided(request.query.e3)) {
        // Reconstitute email address from link parameters TODO decode
        let email = request.query.e1 + "@" + request.query.e2 + "." + request.query.e3
        
        let theQuery = "UPDATE Members SET Verification = 1 WHERE Email = $1"
        let values = [email]

        pool.query(theQuery, values)
            .then(result => {
                // Inform user of verification.
                sendEmail(process.env.SENDER_EMAIL, email,
                    "Email Verified!", "Thank you for verifying your account, you may now log in through our app.")
                //Success message
                response.status(201).send({
                    success: true,
                    message: "success, please check your email."
                })
            })
            .catch((error) => {
                //log the error
                console.log(error)
            })
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
})

// "return" the router
module.exports = router