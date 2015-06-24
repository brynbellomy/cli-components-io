var eyes = require('eyes');
var chalk = require('chalk');
var inspector = eyes.inspector({ stream: null, });
var Logger = (function () {
    function Logger(prefixString, tabString) {
        if (prefixString === void 0) { prefixString = null; }
        if (tabString === void 0) { tabString = '    '; }
        this.folderDepth = 0;
        this.tab = tabString;
        this.prefix = prefixString;
        this.outStream = process.stderr;
    }
    Logger.prototype.writeOutput = function (str) {
        this.outStream.write(str);
    };
    Logger.prototype.prettyPrint = function (obj, label) {
        if (label === void 0) { label = ''; }
        this.println(label, this.prettyFormat(obj));
    };
    Logger.prototype.prettyFormat = function (obj) {
        return inspector(obj);
    };
    Logger.prototype.print = function () {
        var str = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            str[_i - 0] = arguments[_i];
        }
        var padding = new Array(str.length).join(this.tab);
        var maybePrefix = (!!this.prefix ? this.prefix + ' ' : '');
        this.writeOutput(maybePrefix + padding + str.join(' '));
    };
    Logger.prototype.println = function () {
        var str = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            str[_i - 0] = arguments[_i];
        }
        if (str === null || str === undefined || str.length === 0 || str[0] === null || str[0] === undefined) {
            this.writeOutput('\n');
        }
        else {
            this.print(str.join(' ') + '\n');
        }
    };
    Logger.prototype.dieError = function (err) {
        process.stderr.write([chalk.red(err), err.stack || ''].join('\n'));
        process.exit(1);
    };
    /**
        Colorizes and formats a simple "header" kind of thing.  You can surround text in asterisks to apply a highlight.  For example: "Installing *someprogram* version *1.0*"
     */
    Logger.prototype.header = function (text) {
        var matches = text.match(/\*[^\*]+\*/g);
        matches.forEach(function (match) {
            var extracted = match.replace(/(^\*)|(\*$)/g, '');
            text = text.replace(match, '' + chalk.white.bold(extracted));
        });
        var stars = '' + chalk.yellow('***');
        return [stars, text, stars].join(' ');
    };
    Logger.prototype.indent = function () {
        this.folderDepth++;
    };
    Logger.prototype.unindent = function () {
        this.folderDepth--;
    };
    return Logger;
})();
exports.Logger = Logger;
var settings = {
    currentProcessLogger: new Logger()
};
exports.settings = settings;
function logger() {
    return settings.currentProcessLogger;
}
exports.logger = logger;
function prettyPrint(obj, label) {
    if (label === void 0) { label = ''; }
    logger().prettyPrint(obj, label);
}
exports.prettyPrint = prettyPrint;
function prettyFormat(obj) {
    return logger().prettyFormat(obj);
}
exports.prettyFormat = prettyFormat;
function print(str) {
    logger().print(str);
}
exports.print = print;
function println(str) {
    logger().println(str);
}
exports.println = println;
function dieError(err) {
    logger().dieError(err);
}
exports.dieError = dieError;
/**
    Colorizes and formats a simple "header" kind of thing.  You can surround text in asterisks to apply a highlight.  For example: "Installing *someprogram* version *1.0*"
 */
function header(text) {
    return logger().header(text);
}
exports.header = header;
//# sourceMappingURL=index.js.map