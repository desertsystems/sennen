const request = require('request');

/**
 * Single API request thread
 * used for folking multiple threads
 * from parent process
 */
process.on('message', function(data) {
    var url = data.url;
    var coordinates = data.coordinates;

    var query = {
        lat: coordinates.latitude,
        lng: coordinates.longitude
    }

    request.get({url:url, qs:query}, (error, response, body) => {
        if(!error) {
            var results = JSON.parse(body).results;
            coordinates.sunrise = results.sunrise;
            coordinates.day_length = results.day_length;

            process.send(coordinates);
            process.exit(0);

        } else {
            console.log("ERROR: ", error, response);
        }
    });
});