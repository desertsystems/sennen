/**
 * test stub for running Daylight class
 */
var Daylight = require('./daylight');

var daylight = new Daylight();
daylight.loadBatch();
//daylight.load();
//daylight.test();

console.log("Day length for earliest sunrise:", daylight.findDaylightForEarliestSunrise());