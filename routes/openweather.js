const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY

const express = require('express')

const request = require('request');

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

const router = express.Router();


router.get("/", (req, res, next) => {
    if (isStringProvided(req.headers.authorization) && req.headers.authorization.startsWith('6543c')) {
        next()
    } else {
        res.status(400).json({message: "Missing Authorization For OpenWeather API"})
    }
}, (request, response) => {
    if (isStringProvided(request.headers.zipcode)) {
        const unit = "standard"
        const zipcode = request.headers.zipcode
    
        let url = `api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${OPEN_WEATHER_API_KEY}&units=${unit}`
    
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.setRequestHeader("Accept", "application/json");
    
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let weatherJSON = JSON.parse(xhr.responseText);
                response.send(weatherJSON);
            }
        };

        xhr.send();
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }

})
module.exports = router


    /*
    https.get(url, (response) => {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            const id = weatherData.weather[0].id;
        })
    })
})
    */