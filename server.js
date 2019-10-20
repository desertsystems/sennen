/**
 * This is used as a local test server 
 * generates and returns sunrise and 
 * day_length values
 */

var express = require("express");
var server = express();

const port = 3000;

server.use(express.json());

server.listen(port, () => {
    console.log(`server started on port ${port}`);
});

server.get("/daylight", (request, response, next) => {
    setTimeout( () => {
        let daylight = getDaylight();
        response.json(daylight);
    }, 1000);
});

function getDaylight() {
    // mutate sunrise and calculate new day_length
    var hour = Math.round(Math.random()*(9-2)+2); // from 2a to 10am
    var sunrise = hour+':12:12 AM';
    var day_length = 12-hour+7+':00:00';

    console.log(`sunrise: ${sunrise}`);
    console.log(`day_length: ${day_length}`);

    var daylight = { results: {
            sunrise: sunrise,
            sunset: '7:12:12 PM',
            solar_noon: '4:45:19 AM',
            day_length: day_length,
            civil_twilight_begin: '12:00:01 AM',
            civil_twilight_end: '12:00:01 AM',
            nautical_twilight_begin: '12:00:01 AM',
            nautical_twilight_end: '12:00:01 AM',
            astronomical_twilight_begin: '12:00:01 AM',
            astronomical_twilight_end: '12:00:01 AM'
        },
        status: 'OK'
    };

    return daylight;
}
