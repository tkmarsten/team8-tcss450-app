//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../../utilities/exports').pool

const router = express.Router()

/**
 * @api {get} /search/:email Retrieve the user's contacts
 * @apiName GetSearch
 * @apiGroup Search
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} email the user's email.
 * 
 * @apiSuccess (Success 200) {boolean} success true when the user is found
 * 
 * @apiError (400: Missing parameter) {String} message "Missing required information"
 * @apiError (400: Self search query) {String} message "User is searching themselves"
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * @apiError (404: Email not found) {String} message "Email not found"
 * 
 * @apiUse JSONError
 */
router.get("/:email", (request, response, next) => {
    if (!request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response) => {
    let query = `SELECT Members.Email 
                 FROM Members 
                 WHERE Email = $1`
    let values = [request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Email not found"
                })
            } else if (request.decoded.memberid == result.rows[0].memberid) {
                response.status(400).send({
                    message: "User is searching themselves"
                })
            } else {
                response.status(200).send({
                    success: true
                })
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})

module.exports = router