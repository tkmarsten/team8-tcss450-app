// @Author Marc Perez

//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../../utilities/exports').pool

const router = express.Router()

router.get("/", (request, response, next) => {
    let query = `SELECT Members.Email 
                 FROM Members 
                 WHERE Email = $1`
    let values = [request.decoded.email]

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
            response.status(401).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = 'SELECT type FROM pending WHERE memberid=$1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            response.status(200).send({
                notifications : list
            })
        }).catch(error => {
            response.status(401).send({
                message: "SQL Error: Retrieving List",
                error: error
            })
        })
})


router.delete("/", (request, response, next) => {
    let query = `SELECT Members.Email 
                 FROM Members 
                 WHERE Email = $1`
    let values = [request.decoded.email]

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
            response.status(401).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = 'DELETE FROM pending WHERE memberid=$1'
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            response.status(200).send({
                message : "Pending notifications deleted."
            })
        }).catch(error => {
            response.status(402).send({
                message: "SQL Error: Clearing List",
                error: error
            })
        })
})

module.exports = router