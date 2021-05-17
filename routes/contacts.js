//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

/*
router.get("/:email?", (request, response) => {
    let query = `SELECT Members.FirstName, Members.LastName, Members.Nickname, Members.Email FROM Members WHERE MemberID IN (SELECT MemberID_A FROM Contacts WHERE MemberID_A = $1)`
    let values = [request.decoded.memberid]

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
})*/

router.get('/:username?', (request, response, next) => {
    // Empty parameter operation
    if (!request.params.username) {
        let query =
            `SELECT FirstName, LastName, Nickname, MemberId 
        FROM Members 
        WHERE MemberID 
        IN 
        ((SELECT MemberID_B FROM Contacts WHERE (MemberID_A=$1 AND Verified=1)) 
        UNION ALL
        (SELECT MemberID_A FROM Contacts WHERE (MemberID_B=$1 AND Verified=1)))`
        let values = [request.decoded.memberid]

        pool.query(query, values)
            .then(result => {
                if (result.rowCount == 0) {
                    response.status(400).send({
                        message: "No contacts exist",
                    })
                } else {
                    response.send({
                        contacts: result.rows
                    })
                }
            }).catch(error => {
                response.status(400).send({
                    message: "SQL Error on memberId check",
                    error: error
                })
            })
    } else {
        next()
    }
}, (request, response, next) => {

    // Convert the username to a memberId so you can check it's status in the contacts table
    let query = "SELECT MEMBERID FROM MEMBERS WHERE USERNAME=$1"
    let values = [request.params.username]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(400).send({
                    message: "Username not found"
                })
            } else {
                response.locals.memberid = result.rows[0].memberid
                next()
            }
        })
}, (request, response) => {

    // Check if you're already contacts or have an open contact request. If you are, throw error, if not then send a success result
    let query = 'SELECT * FROM CONTACTS WHERE (MemberID_A=$1 AND MemberID_B=$2) OR (MemberID_A=$2 AND MemberID_B=$1)'
    let values = [request.decoded.memberid, response.locals.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount != 0) {
                if (result.rows[0].verified == 1) {
                    response.status(400).send({
                        message: "User is already a contact",
                    })
                } else {
                    response.status(400).send({
                        message: "There is already an open contact request with this person",
                    })
                }
            } else {
                response.send({
                    type: "checkContact",
                    result: true
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