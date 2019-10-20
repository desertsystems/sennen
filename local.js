/**
 * running Daylight class
 */
var Daylight = require('./daylight');

const url = "http://localhost:3000/daylight";

var daylight = new Daylight();
daylight.setUrl(url);
daylight.run();