// Mailer only used for debug and has no function in the application. It can be removed or commented out at a later date.

//express is the framework we're going to use to handle requests
const express = require('express')

const sendEmail = require('../utilities').sendEmail

//retrieve the router object from express
var router = express.Router()

router.post("/", (request, response) => {
    response.send({
        message: "Attempting eMail..."
    })
    sendEmail(process.env.SENDER_EMAIL, "TacomaHuskyTester@gmail.com",
        "Email Sender Is Working!", "Email Successfully Sent.")
})

// "return" the router
module.exports = router