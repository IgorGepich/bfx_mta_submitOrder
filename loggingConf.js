import log4js from "log4js"
log4js.configure({
    appenders: {
        out: { type: 'console' },
        debug: { type: 'dateFile', filename: 'logs/debug',"pattern":"-dd-MM.log", alwaysIncludePattern:true},
        error: { type: 'dateFile', filename: 'logs/error', "pattern":"-dd-MM.log",alwaysIncludePattern:true},
        info: { type: 'dateFile', filename: 'logs/info', "pattern":"-dd-MM.log",alwaysIncludePattern:true},
        default: { type: 'dateFile', filename: 'logs/default', "pattern":"-dd-MM.log",alwaysIncludePattern:true}
    },
    categories: {
        info: { appenders: ['info'], level: 'info' },
        debug: { appenders: ['debug'], level: 'debug' },
        error: { appenders: ['error'], level: 'error' },
        default: { appenders: ['default'], level: 'info' }
    }}
);

const submitLog = log4js.getLogger("info")
const errorLog = log4js.getLogger("error")
const debugLog = log4js.getLogger("debug")
const defaultLog = log4js.getLogger("default")

export {submitLog, errorLog, debugLog, defaultLog}
