const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY

const express = require('express')

const request = require('request')

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const router = express.Router();


router.get("/", (req, res, next) => {
    if (isStringProvided(req.headers.authorization) && req.headers.authorization.startsWith('6543c')) {
        next()
    } else {
        res.status(400).json({message: "Missing Authorization For OpenWeather API"})
    }
}, (req, res) => {
    if (isStringProvided(req.headers.zipcode)) {
        const unit = "standard";
        const zipcode = req.headers.zipcode;
    
        let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${OPEN_WEATHER_API_KEY}&units=${unit}`;

        let options = {json: true};
 /* 
        var xhr = new XMLHttpRequest();

        xhr.open("GET", url);
        
        xhr.setRequestHeader("Accept", "application/json");
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let weatherJSON = JSON.parse(xhr.responseText);
                response.send(weatherJSON);
            }
        };

        xhr.send();
*/

        request(url, options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(JSON.stringify(body))
                res.send(body);
            } else {
                console.log(error);
                res.send({error: url});
            }
        });

    } else {
        res.status(400).send({
            message: "Missing required zipcode information"
        })
    }
})
module.exports = router