//express is the framework we're going to use to handle requests
const express = require('express')
//Create a new instance of express
const app = express()

//Access the connection to Heroku Database
const pool = require('./utilities').pool

let middleware = require('./middleware')

/*
 * This middleware function parses JSON in the body of POST requests
 */
app.use(express.json())

/*
 * This middleware function will respond to improperly formed JSON in 
 * request parameters.
 */
app.use(middleware.jsonErrorInBody)

const validation = require('./utilities').validation
let isStringProvided = validation.isStringProvided

app.use('/auth', require('./routes/auth/signin'))
app.use('/auth', require('./routes/auth/register'))
app.use('/mailer', require('./routes/mailer.js'))
app.use('/verify', require('./routes/auth/verify.js'))
app.use('/reset', require('./routes/auth/password/reset.js'))
app.use('/newpw', require('./routes/auth/password/newpw.js'))
app.use('/messages', middleware.checkToken, require('./routes/chat/messages.js'))
app.use('/chats', middleware.checkToken, require('./routes/chat/chats.js'))
app.use('/auth', middleware.checkToken, require('./routes/auth/pushyregister.js'))
app.use('/notifs', middleware.checkToken, require('./routes/auth/notifs.js'))
app.use('/weather', require('./routes/openweather.js'))
app.use('/contacts', middleware.checkToken, require('./routes/contacts/contacts.js'))
app.use('/requests', middleware.checkToken, require('./routes/contacts/requests.js'))
app.use('/search', middleware.checkToken, require('./routes/contacts/search.js'))

/*
 * Serve the API documentation generated by apidoc as HTML. 
 * https://apidocjs.com/
 */
app.use("/doc", express.static('apidoc'))

/* 
* Heroku will assign a port you can use via the 'PORT' environment variable
* To access an environment variable, use process.env.<ENV>
* If there isn't an environment variable, process.env.PORT will be null (or undefined)
* If a value is 'falsy', i.e. null or undefined, javascript will evaluate the rest of the 'or'
* In this case, we assign the port to be 5000 if the PORT variable isn't set
* You can consider 'let port = process.env.PORT || 5000' to be equivalent to:
* let port; = process.env.PORT;
* if(port == null) {port = 5000} 
*/
app.listen(process.env.PORT || 5000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 5000));
});