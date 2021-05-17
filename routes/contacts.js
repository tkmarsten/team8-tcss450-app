//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool

const router = express.Router()

router.get("/:email?", (request, response) => {
    let query = `SELECT * FROM Contacts WHERE MemberID_A = $1`
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
})

module.exports = router