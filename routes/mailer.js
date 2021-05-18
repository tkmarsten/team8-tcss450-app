//express is the framework we're going to use to handle requests
const express = require('express')

const sendEmail = require('../utilities').sendEmail

//retrieve the router object from express
var router = express.Router()

router.get("/", (request, response) => {
    response.send({
        message: "Hello, you sent a GET request"
    })
})

router.post("/", (request, response) => {
    response.send({
        message: "Attempting eMail..."
    })
    sendEmail(process.env.SENDER_EMAIL, "perezm68@uw.edu", "Email Sender Is Working!", "Email Successfully Sent.")
})

// "return" the router
module.exports = router