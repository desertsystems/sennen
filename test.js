/**
 * unit tests for Daylight class
 */
const {describe} = require('mocha');
const {expect} = require('chai');

var Daylight = require('./daylight');

const url = "http://localhost:3000/daylight";

var daylight = new Daylight();
daylight.setUrl(url);
//daylight.run();

/**
 * run unit test with following command:
 * >> ./node_modules/.bin/mocha test.js
 */

describe("test random generation of coordinates:", () => {
    daylight.populateCoordinates(daylight.COORDINATES_SIZE);
    var lastCoordinate = daylight.list[daylight.COORDINATES_SIZE-1];
    
    it(`generated list size should be ${daylight.COORDINATES_SIZE}`, () => {
        expect(daylight.COORDINATES_SIZE).to.equal(daylight.list.length);
    });

    it(`generated latitude should be between ${daylight.MIN_LATITUDE} and ${daylight.MAX_LATITUDE}`, () => {
        expect(lastCoordinate.latitude).to.be.above(daylight.MIN_LATITUDE).and.to.be.below(daylight.MAX_LATITUDE);
    });

    it(`generated longitude should be between ${daylight.MIN_LONGITUDE} and ${daylight.MAX_LONGITUDE}`, () => {
        expect(lastCoordinate.longitude).to.be.above(daylight.MIN_LONGITUDE).and.to.be.below(daylight.MAX_LONGITUDE);
    });
});

describe("test day length for earliest sunrise:", () => {
    // generate mocked processed list
    daylight.processedList = [{
        "latitude":41.17648337336706,
        "longitude":13.8373136620269,
        "sunrise":"7:12:12 AM",
        "day_length":"12:00:00"
    },
    {
        "latitude":-7.82502766967697,
        "longitude":160.68762558950073,
        "sunrise":"4:12:12 AM",
        "day_length":"18:00:00"
    },
    {
        "latitude":-15.820163712385806,
        "longitude":43.69786343645947,
        "sunrise":"8:12:12 AM",
        "day_length":"10:00:00"
    }];

    // day length for earliest sunrise
    var dayLength = daylight.processedList[1].day_length;

    it(`day length for earliest sunrise should be ${dayLength}`, () => {
        expect(dayLength).to.equal(daylight.earliestSunrise());
    });
});