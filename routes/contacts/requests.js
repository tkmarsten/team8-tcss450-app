//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../../utilities/exports').pool

const router = express.Router()

/**
 * @api {post} /contacts Add another user to your contacts
 * @apiName PostContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} email the contact's email.
 * 
 * @apiSuccess (Success 200) {boolean} success true when the contact is added
 * 
 * @apiError (400: Missing body) {String} message "Missing required information"
 * @apiError (400: Duplicate contact) {String} message "User is already a contact"
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * @apiError (404: Email not found) {String} message "Email not found"
 * 
 * @apiUse JSONError
 */
router.post('/', (request, response, next) => {
    response.locals.memberid = null

    if ((!request.body.email)) {
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
            } else if (request.decoded.memberid == result.rows[0].memberid) {
                response.status(400).send({
                    message: "User attempting to add themselves"
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
}, (request, response, next) => {
    let query = `SELECT MemberID_A, MemberID_B 
                 FROM Contacts
                 WHERE (MemberID_A = $1 AND MemberID_B = $2 AND Verified = 0)
                 OR (MemberID_B = $1 AND MemberID_A = $2 AND Verified = 0)`
    let values = [request.decoded.memberid, response.locals.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.status(400).send({
                    message: "There is already a pending request"
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
}, (request, response, next) => {
    let query = `SELECT MemberID_A, MemberID_B 
                 FROM Contacts
                 WHERE (MemberID_A = $1 AND MemberID_B = $2 AND Verified = 1)
                 OR (MemberID_B = $1 AND MemberID_A = $2 AND Verified = 1)`
    let values = [request.decoded.memberid, response.locals.memberid]

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
}, (request, response, next) => {
    let query = `INSERT INTO Contacts (MemberID_A, MemberID_B, Verified)
    VALUES($1, $2, 0)
    RETURNING * `
    let values = [request.decoded.memberid, response.locals.memberid]

    pool.query(query, values)
        .then(result => {
            next();
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    let query = `SELECT Token 
                 FROM Push_Token 
                 WHERE memberid = $1`
    let values = [response.locals.memberid]

    pool.query(query, values)
        .then(result => {
            msg_functions.sendContactRequestToIndividual(
                result.rows[0].token, request.body.sender, response.locals.memberid)
            response.status(200).send({
                success: true,
                message: "Request sent"
            })
            
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
// }, (request, response) => {
//     let query =  `INSERT INTO Pending (MemberID, type)
//                 VALUES($1, $2)
//                 RETURNING * `
//     let values = [response.locals.memberid, "Contact"]

//     pool.query(query, values)
//         .then(result => {
//             // msg_functions.sendContactRequestToIndividual(
//             //     result.rows[0].token, request.body.sender, response.locals.memberid)
//             // response.status(200).send({
//             //     success: true,
//             //     message: "Request sent, Notification logged: " + result.rows[0].primarykey
//             // })
//         }).catch(error => {
//             response.status(400).send({
//                 message: "SQL Error",
//                 error: error
//             })
//         })
})

/**
 * @api {get} /contacts/:email Retrieve the user's contact requests
 * @apiName GetRequests
 * @apiGroup Requests
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} email the user's email.
 * 
 * @apiSuccess {Object[]} members List of contact requests
 * @apiSuccess {String} members.email The email of the contact
 * 
 * @apiError (400: Missing parameter) {String} message "Missing required information"
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
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = `SELECT Members.Email
    FROM Members
    WHERE MemberID
    IN (SELECT MemberID_A FROM Contacts WHERE MemberID_B = $1 AND Verified = 0)`
    let values = [request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            response.send({
                requests: result.rows
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})

/**
 * @api {delete} /contacts Remove user's selected contact
 * @apiName DeleteContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} email the contact's email.
 * 
 * @apiSuccess (Success 200) {boolean} success true when the contact is deleted
 * 
 * @apiError (400: Missing body) {String} message "Missing required information"
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * @apiError (404: Email not found) {String} message "Email not found"
 * 
 * @apiUse JSONError
 */
router.delete('/:email', (request, response, next) => {
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
            } else if (request.decoded.memberid == result.rows[0].memberid) {
                response.status(400).send({
                    message: "User attempting to delete themselves"
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
    let query = `DELETE FROM Contacts 
                 WHERE (MemberID_A = $1 AND MemberID_B = $2 AND Verified = 0)
                 RETURNING *`
    let values = [response.locals.memberid, request.decoded.memberid]

    pool.query(query, values)
        .then(result => {
            response.send(200).send({
                success: true,
                message: "Request removed"
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})

module.exports = router