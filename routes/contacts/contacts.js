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
                 WHERE (MemberID_A = $1 AND MemberID_B = $2)
                 OR (MemberID_B = $1 AND MemberID_A = $2)`
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
}, (request, response) => {
    let query = `INSERT INTO Contacts (MemberID_A, MemberID_B) 
                 VALUES ($1, $2)
                 RETURNING *`
    let values = [request.decoded.memberid, response.locals.memberid]

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

/**
 * @api {get} /contacts/:email Retrieve the user's contacts
 * @apiName GetContacts
 * @apiGroup Contacts
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} email the user's email.
 * 
 * @apiSuccess {Object[]} members List of contacts
 * @apiSuccess {String} members.firstname The first name of the contact
 * @apiSuccess {String} members.lastname The last name of the contact
 * @apiSuccess {String} members.nickname The nickname of the contact
 * @apiSuccess {String} members.email The email of the contact
 * 
 * @apiError (400: Missing parameter) {String} message "Missing required information"
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * @apiError (404: Email not found) {String} message "Email not found"
 * 
 * @apiUse JSONError
 */
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
                 WHERE (MemberID_A = $1 AND MemberID_B = $2) 
                 OR (MemberID_A = $2 AND MemberID_B = $1) 
                 RETURNING *`
    let values = [request.decoded.memberid, response.locals.memberid]

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