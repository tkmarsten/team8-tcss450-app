//express is the framework we're going to use to handle requests
const express = require('express')

//retrieve the router object from express
var router = express.Router()

const sendEmail = require('../utilities').sendEmail

/**
 * @api {get} /hello Request a Hello World message
 * @apiName GetHello
 * @apiGroup Hello
 *
 * @apiSuccess {String} message Hello World message
 */
router.get("/mailer", (request, response) => {
    sendEmail("","","","");
    response.send({
        message: "Hello, you sent a GET request"
    })
})

/**
 * @api {post} /hello Request a Hello World message
 * @apiName PostHello
 * @apiGroup Hello
 * 
 * @apiSuccess {String} message Hello World message
 */
router.post("/mailer", (request, response) => {
    sendEmail("","","","");
    response.send({
        message: "Hello, you sent a POST request"
    })
})

// "return" the router
module.exports = router