var CLI = require('./cli');
//const os = require('os');
const ramda = require('ramda');
const process = require('process');
const parallel = require('child_process');


class Daylight {

    constructor() {
        // coordinates to 7 decimal places specify percision of 1cm
        this.COORDINATES_SIZE = 100;
        this.MIN_LATITUDE = -90.0000000;
        this.MAX_LATITUDE = 90.0000000;
        this.MIN_LONGITUDE = -180.0000000;
        this.MAX_LONGITUDE = 180.0000000;
        this.URL = "https://api.sunrise-sunset.org/json";
        this.BATCH_SIZE = 5;
        this.TIMEOUT = 5000; // 5 seconds
        this.list = [];
        this.processedList = [];
        this.loading = 0;

        this.c = new CLI(); // colours and styles for cli
    }

    setUrl(url) {
        this.URL = url;
        console.log(`${this.c.CYAN}using url: ${this.URL}${this.c.RESET}`);
    }

    /**
     * finds and returns day length for earliest sunrise
     */
    earliestSunrise() {
        var dayLength = "";
        var earliestSunrise = ramda.apply(ramda.min, ramda.pluck('sunrise', this.processedList))
        
        this.processedList.forEach(coordinates => {
            if(coordinates.sunrise == earliestSunrise) dayLength = coordinates.day_length;
        });

        return dayLength;
    }

    async run() {
        let status = await this.load();
        if(status == "process-complete") {
            var dayLength = this.earliestSunrise();
            console.log(`${this.c.YELLOW}\nDay length for earliest sunrise is ${this.c.RED}${dayLength} Hours`);
            console.log(`${this.c.RESET}`);
        }
    }

    async load() {
        // generate a list of random coordinates
        console.log(`generaing a list of ${this.COORDINATES_SIZE} random coordinates...`);
        this.populateCoordinates(this.COORDINATES_SIZE);

        // itterate through list to populate data via rest api requests 
        let processStatus = new Promise((resolve, reject) => {
            console.log("populating sunrise and day_length data for each coordinates...");
            for(var i = 0; i < this.list.length; i += this.BATCH_SIZE) {
                // divide list into batch sized arrays
                var batch = this.list.slice(i, i+this.BATCH_SIZE);
    
                // process each batch
                this.processBatch(batch, () => {
                    // resolve promise when process is complete
                    if(this.list.length == this.processedList.length) {
                        resolve("process-complete");
                    }
                });
            }
        });

        // wait for process to complete
        let status = await processStatus;
        return status;
    }

    /**
     * Process API requests in batches
     * batchComplete is called when the last
     * request has completed
     * @param {*} batch 
     * @param {*} batchComplete 
     */
    async processBatch(batch, batchComplete) {
        for(var i=0; i < batch.length; i++) {
            this.processRequest(batch[i], () => {
                if(i == batch.length) {
                    batchComplete();
                }
            });
        }

        // timeout before next batch is started
        let timeout = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("batch-complete");
            }, this.TIMEOUT);
        });

        let status = await timeout;
        return status;
    }

    /**
     * Process API request as folked process
     * requestComplete is called when folked
     * process sends 'exit' event
     * @param {*} request 
     * @param {*} requestComplete 
     */
    async processRequest(request, requestComplete) {
        let requestStatus = new Promise((resolve, reject) => {
            var process = parallel.fork('request.js');
            
            process.send({
                "url": this.URL,
                "coordinates": request
            });
    
            process.on('message', async (result) => {
                this.processedList.push(result);
                this.percentageLoaded();
            });
    
            process.on('exit', () => {
                resolve("request-complete");
                requestComplete();
            });
        });

        let status = await requestStatus;
        return status;
    }

    /**
     * populates a given number of 
     * random coordinates into 
     * an array list
     * @param {*} amount 
     */
    populateCoordinates(amount) {
        var i;
        for(i = 0; i < amount; i++) {
            var coordinates = {
                latitude: this.generateCoordinate(this.MIN_LATITUDE, this.MAX_LATITUDE),
                longitude: this.generateCoordinate(this.MIN_LONGITUDE, this.MAX_LONGITUDE)
            };
    
            this.list.push(coordinates);
        }
    }

    /**
     * Generates random coordinates
     * between given min and max value
     * @param {*} min 
     * @param {*} max 
     */
    generateCoordinate(min, max) {
        return Math.random() * (max-min)+min;
    }

    /**
     * displays percentage loaded on cli
     */
    percentageLoaded() {
        this.loading++;

        if(this.loading > 0) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }

        process.stdout.write(`${this.c.GREEN}${this.loading}%${this.c.RESET}`);
        if(this.loading == 100) process.stdout.write(`${this.c.RESET}\n\n`);
    }
}
module.exports = Daylight;