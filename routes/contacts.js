//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

router.post('/', (request, response, next) => {
    response.locals.contactMemberid = null

    if (!request.body.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (request, response, next) => {
    let query = `SELECT Members.MemberID 
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
                response.locals.contactMemberid = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    let query = `SELECT MemberID_A, MemberID_B 
                 FROM Contacts
                 WHERE (MemberID_A = $1 AND MemberID_B = $2)
                 OR (MemberID_B = $1 AND MemberID_A = $2)`
    let values = [request.decoded.memberid, response.locals.contactMemberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.status(400).send({
                    message: "User is already a contact"
                })
            } else {
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = `INSERT INTO Contacts (MemberID_A, MemberID_B) 
                 VALUES ($1, $2)
                 RETURNING *`
    let values = [request.decoded.memberid, response.locals.contactMemberid]

    pool.query(query, values)
        .then(result => {
            response.send(200).send({
                success: true,
                message: "Contact added"
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
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
        next()
    }
}, (request, response, next) => {
    let query = `SELECT Members.MemberID 
                 FROM Members 
                 WHERE Email = $1`
    let values = [request.params.email]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(404).send({
                    message: "Email not found"
                })
            } else {
                response.locals.memberid = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = `SELECT Members.FirstName, Members.LastName, Members.Nickname, Members.Email
                 FROM Members 
                 WHERE MemberID 
                 IN ((SELECT MemberID_B FROM Contacts WHERE MemberID_A = $1)
                 UNION ALL (SELECT MemberID_A FROM Contacts WHERE MemberID_B = $1))`
    let values = [response.locals.memberid]

    pool.query(query, values)
        .then(result => {
            response.send({
                contacts: result.rows
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})


router.delete('/', (request, response, next) => {
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
    let query = `SELECT Members.MemberID FROM Members WHERE Email = $1`
    let values = [request.body.email]

    pool.query(query, values)
        .then(result => {
            response.locals.contactMemberid = result.rows[0].memberid
            next()
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = `DELETE FROM Contacts WHERE (MemberID_A = $1 AND MemberID_B = $2) OR (MemberID_A = $2 AND MemberID_B = $1) RETURNING *`
    let values = [response.locals.memberid, response.locals.contactMemberid]

    pool.query(query, values)
        .then(result => {
            response.send(200).send({
                success: true,
                message: "Contact removed"
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})

module.exports = router