//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../../utilities').pool

const validation = require('../../utilities').validation
let isStringProvided = validation.isStringProvided

const generateHash = require('../../utilities').generateHash
const generateSalt = require('../../utilities').generateSalt

const sendEmail = require('../../utilities').sendEmail

const router = express.Router()

/**
 * @api {post} /auth Request to register a user
 * @apiName PostAuth
 * @apiGroup Auth
 * 
 * @apiParam {String} first a users first name
 * @apiParam {String} last a users last name
 * @apiParam {String} email a users email *unique
 * @apiParam {String} password a users password
 * @apiParam {String} [username] a username *unique, if none provided, email will be used
 * 
 * @apiParamExample {json} Request-Body-Example:
 *  {
 *      "first":"Charles",
 *      "last":"Bryan",
 *      "email":"cfb3@fake.email",
 *      "password":"test12345"
 *  }
 * 
 * @apiSuccess (Success 201) {boolean} success true when the name is inserted
 * @apiSuccess (Success 201) {String} email the email of the user inserted 
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: Username exists) {String} message "Username exists"
 * 
 * @apiError (400: Email exists) {String} message "Email exists"
 *  
 * @apiError (400: Other Error) {String} message "other error, see detail"
 * @apiError (400: Other Error) {String} detail Information about th error
 * 
 */
router.post('/', (request, response) => {

    //Retrieve data from query params
    const first = request.body.first
    const last = request.body.last
    const nickname = request.body.nickname
    const email = request.body.email
    const password = request.body.password
    const link = "https://team8-tcss450-app.herokuapp.com/verify";
    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if (isStringProvided(first)
        && isStringProvided(last)
        && isStringProvided(nickname)
        && isStringProvided(email)
        && isStringProvided(password)) {
        //We're storing salted hashes to make our application more secure
        //If you're interested as to what that is, and why we should use it
        //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
        let salt = generateSalt(32)
        let salted_hash = generateHash(password, salt)

        //We're using placeholders ($1, $2, $3) in the SQL query string to avoid SQL Injection
        //If you want to read more: https://stackoverflow.com/a/8265319
        let theQuery = "INSERT INTO MEMBERS(FirstName, LastName, Nickname, Email, Password, Salt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING Email"
        let values = [first, last, nickname, email, salted_hash, salt]
        pool.query(theQuery, values)
            .then(result => {
                // convert email to ASCII for usage in URL
                let params = "?email=" + getCharCodes(email)
                sendEmail(process.env.SENDER_EMAIL, email, "Welcome to our App!", "Please verify your Email account by following the link below.\n\n"
                    + link + params)
                console.log("New Member: " + email)
                //We successfully added the user!
                response.status(201).send({
                    success: true,
                    email: result.rows[0].email
                })
            })
            .catch((error) => {
                //log the error
                // console.log(error)
                if (error.constraint == "members_username_key") {
                    response.status(400).send({
                        message: "Username exists"
                    })
                } else if (error.constraint == "members_email_key") {
                    response.status(400).send({
                        message: "Email exists"
                    })
                } else {
                    response.status(400).send({
                        message: "other error, see detail",
                        detail: error.detail
                    })
                }
            })
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
})

router.get('/hash_demo', (request, response) => {
    let password = 'hello12345'

    let salt = generateSalt(32)
    let salted_hash = generateHash(password, salt)
    let unsalted_hash = generateHash(password)

    response.status(200).send({
        'salt': salt,
        'salted_hash': salted_hash,
        'unsalted_hash': unsalted_hash
    })
})

// modified from: https://javascript.plainenglish.io/javascript-algorithm-convert-string-characters-into-ascii-bb53ae928331
function getCharCodes(s) {
    let charCodes = "";

    for (let i = 0; i < s.length; i++) {
        let code = s.charCodeAt(i);
        charCodes = charCodes.concat(code);
        charCodes = charCodes.concat("-");
    }

    return charCodes;
}

module.exports = router