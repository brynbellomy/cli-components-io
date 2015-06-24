
import * as eyes from 'eyes'
import * as chalk from 'chalk'

const inspector = eyes.inspector({ stream: null, })


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
        const padding = new Array(str.length).join(this.tab)
        const maybePrefix = (!!this.prefix ? this.prefix + ' ' : '')
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

    /**
        Colorizes and formats a simple "header" kind of thing.  You can surround text in asterisks to apply a highlight.  For example: "Installing *someprogram* version *1.0*"
     */
    header (text: string) {
        const matches = text.match(/\*[^\*]+\*/g)
        matches.forEach(function (match) {
            const extracted = match.replace(/(^\*)|(\*$)/g, '')
            text = text.replace(match, '' + chalk.white.bold(extracted))
        })
        const stars = '' + chalk.yellow('***')
        return [stars, text, stars].join(' ')
    }

    indent(): void {
        this.folderDepth++
    }

    unindent(): void {
        this.folderDepth--
    }
}

let settings = {
    currentProcessLogger: new Logger()
}

function logger() {
    return settings.currentProcessLogger
}

function prettyPrint(obj: any, label: string = '') {
    logger().prettyPrint(obj, label)
}

function prettyFormat(obj: any) {
    return logger().prettyFormat(obj)
}

function print(str: string) {
    logger().print(str)
}

function println(str: string) {
    logger().println(str)
}

function dieError(err: any) {
    logger().dieError(err)
}

/**
    Colorizes and formats a simple "header" kind of thing.  You can surround text in asterisks to apply a highlight.  For example: "Installing *someprogram* version *1.0*"
 */
 function header(text: string) {
     return logger().header(text)
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
    dieError,
    header,
}

