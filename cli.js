class CLI {
    constructor() {
        // font/forground colours
        this.BLACK = "\x1b[30m";
        this.RED = "\x1b[31m";
        this.GREEN = "\x1b[32m";
        this.YELLOW = "\x1b[33m";
        this.BLUE = "\x1b[34m";
        this.MAGENTA = "\x1b[35m";
        this.CYAN = "\x1b[36m";
        this.WHITE = "\x1b[37m";

        // backgroud colours
        this.BG_BLACK = "\x1b[40m";
        this.BG_RED = "\x1b[41m";
        this.BG_GREEN = "\x1b[42m";
        this.BG_YELLOW = "\x1b[43m";
        this.BG_BLUE = "\x1b[44m";
        this.BG_MAGENTA = "\x1b[45m";
        this.BG_CYAN = "\x1b[46m";
        this.BG_WHITE = "\x1b[47m";

        // styles
        this.RESET = "\x1b[0m";
        this.BRIGHT = "\x1b[1m";
        this.DIM = "\x1b[2m";
        this.UNDERSCORE = "\x1b[4m";
        this.BLINK = "\x1b[5m";
        this.REVERSE = "\x1b[7m";
        this.HIDDEN = "\x1b[8m";
    }
}
module.exports = CLI;