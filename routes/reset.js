// TODO accepts JWT token in URL as verification.
//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities').pool

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

const generateHash = require('../utilities').generateHash

const sendEmail = require('../utilities').sendEmail

//retrieve the router object from express
var router = express.Router()

//Pull in the JWT module along with out a secret key
const jwt = require('jsonwebtoken')
const config = {
    secret: process.env.JSON_WEB_TOKEN
}
const link = "https://team8-tcss450-app.herokuapp.com/reset"

router.get('/', (request, response, next) => {
    if (isStringProvided(request.headers.authorization) && request.headers.authorization.startsWith('Basic ')) {
        next()
    } else {
        response.status(400).json({ message: 'Missing Authorization Header' })
    }
}, (request, response, next) => {
    // obtain auth credentials from HTTP Header
    const base64Credentials = request.headers.authorization.split(' ')[1]

    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')

    const [email] = credentials.split(':')

    if (isStringProvided(email)) {
        request.auth = {
            "email": email
        }
        next()
    } else {
        response.status(400).send({
            message: "Malformed Authorization Header"
        })
    }
}, (request, response) => {
    const theQuery = "SELECT MemberId FROM Members WHERE Email=$1"
    const values = [request.auth.email]
    pool.query(theQuery, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: 'User not found'
                })
                return
            }

            sendEmail(process.env.SENDER_EMAIL, request.auth.email,
                "Password Reset Request", "Follow the link below to reset your password.\n\n" + link)
                response.json({
                    success: true,
                    message: 'Reset request successfully sent to email!'
                })
                
        })
        .catch((err) => {
            //log the error
            console.log(err.stack)
            response.status(400).send({
                message: err.detail
            })
        })
})

router.post("/", (request, response) => {
    response.send({
        message: "Nothin' to see here, bub."
        // TODO reset password for user here.
    })
})

// "return" the router
module.exports = router