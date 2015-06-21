
import * as eyes from 'eyes'
import * as chalk from 'chalk'

let inspector = eyes.inspector({ stream: null, })


class Logger {
    folderDepth: number;
    tab: string;
    prefix: string;
    outStream: NodeJS.WritableStream;

    constructor(prefixString: string = null, tabString: string = '    ') {
        this.folderDepth = 0
        this.tab = tabString
        this.prefix = prefixString
        this.outStream = process.stderr
    }

    private writeOutput(str: string): void {
        this.outStream.write(str)
    }

    prettyPrint(obj: any, label: string = ''): void {
        this.println(label, this.prettyFormat(obj))
    }

    prettyFormat(obj: any): string {
        return inspector(obj)
    }

    print(...str: string[]): void {
        var padding = new Array(str.length).join(this.tab)
        var maybePrefix = (!!this.prefix ? this.prefix + ' ' : '')
        this.writeOutput(maybePrefix + padding + str.join(' '))
    }

    println(...str: string[]): void {
        if (str === null || str === undefined || str.length === 0 || str[0] === null || str[0] === undefined) {
            this.writeOutput('\n')
        }
        else {
            this.print(str.join(' ') + '\n')
        }
    }

    dieError(err) {
        process.stderr.write([chalk.red(err), err.stack || ''].join('\n'))
        process.exit(1)
    }

    indent(): void {
        this.folderDepth++
    }

    unindent(): void {
        this.folderDepth--
    }
}

var settings = {
    currentProcessLogger: new Logger()
}

function logger(): Logger {
    return settings.currentProcessLogger
}

function prettyPrint(obj: any, label: string = ''): void {
    logger().prettyPrint(obj, label)
}

function prettyFormat(obj: any): string {
    return logger().prettyFormat(obj)
}

function print(str: string): void {
    logger().print(str)
}

function println(str: string): void {
    logger().println(str)
}

function dieError(err: any): void {
    logger().dieError(err)
}

export {
    /** Classes */
    Logger,

    /** Variables */
    settings,

    /** Functions */
    logger,
    prettyPrint,
    prettyFormat,
    print,
    println,
    dieError
}

