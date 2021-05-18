// TODO accepts JWT token in URL as verification.
//express is the framework we're going to use to handle requests
const express = require('express')

const sendEmail = require('../utilities').sendEmail

//retrieve the router object from express
var router = express.Router()

router.get("/", (request, response) => {
    response.send({
        message: "Nothin' to see here, bub."
        // TODO verify email
    })
})

router.post("/", (request, response) => {
    response.send({
        message: "This is where verification happens after a single-use JWT is verified."
    })
    sendEmail(process.env.SENDER_EMAIL, "TacomaHuskyTester@gmail.com",
        "Email Verified!", "Thank you for verifying your email, you may now log in through our app.")
})

// "return" the router
module.exports = router