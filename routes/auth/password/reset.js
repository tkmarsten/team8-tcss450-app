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

//Pull in the JWT module along with out a secret key
const jwt = require('jsonwebtoken')
const config = {
    secret: process.env.JSON_WEB_TOKEN
}
const link = "https://team8-tcss450-app.herokuapp.com/newpw/"

router.get('/', (request, response, next) => {
    // Send Email
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
            // parse email into easy way to send in link TODO encode
            // let e1 = request.auth.email.substring(0, request.auth.email.indexOf("@"))
            // let e2 = request.auth.email.substring(request.auth.email.indexOf("@") + 1, request.auth.email.indexOf("."))
            // let e3 = request.auth.email.substring(request.auth.email.indexOf(".") + 1, request.auth.email.length)
            // let params = "?e1=" + e1 + "&e2=" + e2 + "&e3=" + e3
            let params = "?email=" + getCharCodes(request.auth.email)
            // Send to log
            //console.log( "email: " + request.auth.email + " - link: " + link + params);
            // email link to user to reset password.
            sendEmail(process.env.SENDER_EMAIL, request.auth.email,
                "Password Reset Request", "Follow the link below to reset your password.\n\n" + link + params)
            
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

// modified from: https://javascript.plainenglish.io/javascript-algorithm-convert-string-characters-into-ascii-bb53ae928331
function getCharCodes(s){
    let charCodes = "";
    
    for(let i = 0; i < s.length; i++){
        let code = s.charCodeAt(i);
        charCodes = charCodes.concat(code);
        charCodes = charCodes.concat("-");
    }
    
    return charCodes;
}

// "return" the router
module.exports = router