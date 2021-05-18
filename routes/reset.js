// TODO accepts JWT token in URL as verification.
//express is the framework we're going to use to handle requests
const express = require('express')

//retrieve the router object from express
var router = express.Router()

router.post("/", (request, response) => {
    response.send({
        message: "Nothin' to see here, bub."
    })
})

// "return" the router
module.exports = router