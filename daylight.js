const R = require('ramda');
const Request = require('request');
//const async = require('async');


class Daylight {

    constructor() {
        // coordinates to 7 decimal places specify percision of 1cm
        this.COORDINATES_SIZE = 100;
        this.MIN_LATITUDE = -90.0000000;
        this.MAX_LATITUDE = 90.0000000;
        this.MIN_LONGITUDE = -180.0000000;
        this.MAX_LONGITUDE = 180.0000000;
        this.SUNRISE_SUNSET_API_URL = "https://api.sunrise-sunset.org/json";
        this.list = [];
        this.DAYLIGHT_DATE = "today";
        this.BATCH_SIZE = 5;
        this.PARALLEL_LIMIT = 5;
        this.TIMEOUT = 5000; // 5 seconds
    }

    /**
     * finds and returns day length for earliest sunrise
     */
    findDaylightForEarliestSunrise() {
        var dayLength = "";
        var earliestSunrise = R.apply(R.min, R.pluck('sunrise', this.list))
        
        this.list.forEach(coordinates => {
            if(coordinates.sunrise == earliestSunrise) dayLength = coordinates.day_length;
        });

        return dayLength+" Hours";
    }

    /**
     * callable loads all data in one process
     */
    load() {
        this.populateCoordinates(this.COORDINATES_SIZE);

        this.list.forEach(coordinates => {
            this.populateDaylightHours(coordinates);
        });
    }

    /**
     * callable loads data via batch mode
     */
    loadBatch() {
        this.populateCoordinates(this.COORDINATES_SIZE);

        // create batch list based on BATCH_SIZE
        for(var i = 0; i < this.list.length; i += this.BATCH_SIZE) {
            this.processBatch(this.list.slice(i, i+this.BATCH_SIZE));
        }
    }

    /**
     * process batch and wait for timeout limit
     * @param {*} batch 
     */
    async processBatch(batch) {
        console.log("processBatch:", batch);

        batch.forEach(coordinates => {
            this.populateDaylightHours(coordinates); 
        });

        await new Promise((resolve, reject) => setTimeout(resolve, this.TIMEOUT));
    }
    
    /**
     * populates daylight hours for
     * given coordinates for today
     */
    populateDaylightHours(coordinates) {
        var query = {
            lat: coordinates.latitude,
            lng: coordinates.longitude,
            date: this.DAYLIGHT_DATE
        }
    
        Request.get({url:this.SUNRISE_SUNSET_API_URL, qs:query}, (error, response, body) => {
            if(!error) {
                var results = JSON.parse(body).results;
                coordinates.sunrise = results.sunrise;
                coordinates.day_length = results.day_length;    
    
            } else console.log("ERROR: ", error, response);
        });
    }

    /**
     * populates a given number of 
     * random coordinates into 
     * an array list
     */
    populateCoordinates(amount) {
        var i;
        for(i = 0; i < amount; i++) {
            var coordinates = {
                latitude: this.generateCoordinate(this.MIN_LATITUDE, this.MAX_LATITUDE),
                longitude: this.generateCoordinate(this.MIN_LONGITUDE, this.MAX_LONGITUDE),
                daylight: undefined
            };
    
            this.list.push(coordinates);
        }
    }

    /**
     * Generates random coordinates
     * between given min and max value
     */
    generateCoordinate(min, max) {
        return Math.random() * (max-min)+min;
    }

    /**
     * test stud used to populate dummy data
     * because service blockage 
     * on https://api.sunrise-sunset.org/json
     */
    test() {
        console.log("(using test data... switch to batchLoad)");
        this.populateCoordinates(this.COORDINATES_SIZE);

        var daylight = {
            sunrise: '7:53:09 PM',
            sunset: '1:37:28 PM',
            solar_noon: '4:45:19 AM',
            day_length: '17:44:19',
            civil_twilight_begin: '12:00:01 AM',
            civil_twilight_end: '12:00:01 AM',
            nautical_twilight_begin: '12:00:01 AM',
            nautical_twilight_end: '12:00:01 AM',
            astronomical_twilight_begin: '12:00:01 AM',
            astronomical_twilight_end: '12:00:01 AM'
        }

        this.list.forEach(coordinates => {
            coordinates.sunrise = daylight.sunrise;
            coordinates.day_length = daylight.day_length;
            //console.log(coordinates);
        });
    }
}
module.exports = Daylight;