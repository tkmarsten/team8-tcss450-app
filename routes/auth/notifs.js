// @Author Marc Perez

//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../../utilities/exports').pool

const router = express.Router()

//body should contain email address of self, returns list of pending notifications, then deletes them from db.
router.get("/", (request, response, next) => {

    if (!request.body.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    let query = `SELECT Members.Email 
                 FROM Members 
                 WHERE Email = $1`
    let values = [request.body.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Email not found"
                })
            } else {
                next();
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    let query = 'SELECT type FROM pending WHERE memberid=$1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            list = result;
            next();
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error: Retrieving List",
                error: error
            })
        })
}, (request, response) => {
    let query = 'DELETE FROM pending WHERE memberid=$1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            response.status(200).send({
                notifications : list
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error: Clearing List",
                error: error
            })
        })
})

module.exports = router