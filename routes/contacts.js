//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

router.post('/', (request, response, next) => {
    response.locals.memberid = request.decoded.memberid
    response.locals.contactMemberid = null

    if (!request.body.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    let query = `SELECT Members.MemberID From Members WHERE Email = $1`
    let values = [request.body.email]

    pool.query(query, values)
        .then(result => {
            response.locals.memberid = result.rows[0].memberid
            next()
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
}, (request, response) => {
    let query = `INSERT INTO CONTACTS (MemberID_A, MemberID_B) VALUES ($1, $2)`
    let values = [response.locals.memberid, response.locals.contactMemberid]

    pool.query(query, values)
        .then(result => {
            response.send(200).send({
                success: true,
                message: "Contact added"
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
})

router.get("/:email", (request, response, next) => {
    response.locals.memberid = null

    if (!request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        let query = `SELECT Members.MemberID FROM Members WHERE Email = $1`
        let values = [request.params.email]

        pool.query(query, values)
            .then(result => {
                response.locals.memberid = result.rows[0].memberid
                next()
            }).catch(err => {
                response.status(400).send({
                    message: "SQL Error",
                    error: err
                })
            })
    }
}, (request, response) => {
    let query = `SELECT Members.FirstName, Members.LastName, Members.Nickname, Members.Email FROM Members WHERE MemberID IN (SELECT MemberID_B FROM Contacts WHERE MemberID_A = $1)`
    let values = [response.locals.memberid]

    pool.query(query, values)
        .then(result => {
            response.send({
                contacts: result.rows
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
})

module.exports = router