const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
const WEATHER_BIT_API_KEY = process.env.WEATHER_BIT_API_KEY

const express = require('express')

const request = require('request')

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

const router = express.Router();

// use this connection primarily to get the latitude and
// longitude coordinates from a queried zipcode in the WeatherBit API
router.get("/zipcode_to_lat_long", (req, res, next) => {
    if (isStringProvided(req.headers.authorization) && req.headers.authorization.startsWith('37cb3')) {
        next()
    } else {
        res.status(400).json({message: "Missing Authorization For WeatherBit API"})
    }
}, (req, res) => {
    if (isStringProvided(req.headers.zipcode)) {
        const zipcode = req.headers.zipcode;

        let url = `https://api.weatherbit.io/v2.0/current?` + 
                        `postal_code=${zipcode}&key=${WEATHER_BIT_API_KEY}`;

        let options = {json: true};

        request(url, options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                res.send(JSON.parse(JSON.stringify(body)));
            } else {
                res.send({error: "No Valid Lat/Long Coordinates Found"});
            }
        });
    } else {
        res.status(400).send({
            message: "Missing Zipcode information"
        })
    }
})


// use this connection primarily to get the OpenWeatherMap API 
// current weather conditions data via zipcode
router.get("/current", (req, res, next) => {
    if (isStringProvided(req.headers.authorization) && req.headers.authorization.startsWith('6543c')) {
        next()
    } else {
        res.status(400).json({message: "Missing Authorization For OpenWeather API"})
    }
}, (req, res) => {
    if (isStringProvided(req.headers.zipcode)) {
        const unit = "imperial";
        const zipcode = req.headers.zipcode;
    
        let url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${OPEN_WEATHER_API_KEY}&units=${unit}`;

        let options = {json: true};

        request(url, options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                res.send(JSON.parse(JSON.stringify(body)));
            } else {
                res.send({error: "No Zipcode Found"});
            }
        });

    } else {
        res.status(400).send({
            message: "Missing required zipcode information"
        })
    }
})


// use this connection primarily to get the OpenWeatherMap API 
// hourly weather forecast data via latitude and longitude
router.get("/hourly", (req, res, next) => {
    if (isStringProvided(req.headers.authorization) && req.headers.authorization.startsWith('6543c')) {
        next()
    } else {
        res.status(400).json({message: "Missing Authorization For OpenWeatherMap API"})
    }
}, (req, res, next) => {
    if (isStringProvided(req.headers.latitude) && isStringProvided(req.headers.longitude)) {
        const unit = "imperial";
        const lat = req.headers.latitude;
        const long = req.headers.longitude;

        let url = `https://api.openweathermap.org/data/2.5/onecall?` + 
                    `lat=${lat}&lon=${long}&exclude=current,minutely,daily,alerts` + 
                        `&appid=${OPEN_WEATHER_API_KEY}&units=${unit}`;

        let options = {json: true};

        request(url, options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                res.send(JSON.parse(JSON.stringify(body)));
            } else {
                res.send({error: "No Zipcode Found"});
            }
        });
    } else {
        res.status(400).send({
            message: "Missing required zipcode information"
        })
    }
})



// use this connection primarily to get the WeatherBit API 
// daily weather forecast data via zipcode
router.get("/daily", (req, res, next) => {
    if (isStringProvided(req.headers.authorization) && req.headers.authorization.startsWith('37cb3')) {
        next()
    } else {
        res.status(400).json({message: "Missing Authorization For WeatherBit API"})
    }
}, (req, res, next) => {
    if (isStringProvided(req.headers.zipcode)) {
        const zipcode = req.headers.zipcode;

        let url = `https://api.weatherbit.io/v2.0/forecast/daily?` + 
                        `postal_code=${zipcode}&key=${WEATHER_BIT_API_KEY}&units=I`;

        let options = {json: true};

        request(url, options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                res.send(JSON.parse(JSON.stringify(body)));
            } else {
                res.send({error: "No Zipcode Found"});
            }
        });
        
    } else {
        res.status(400).send({
            message: "Missing required zipcode information"
        })
    }
})

module.exports = router