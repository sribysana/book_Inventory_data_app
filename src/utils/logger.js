const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname);
const LOGS_ROOT = path.join(__dirname, '../../app-logs');

const transport = new winston.transports.DailyRotateFile({
  filename: `${LOGS_ROOT}/log`,
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: process.env.ENV === 'development' ? 'debug' : 'info',
  json: false,
});

const logger = new (winston.Logger)({
  transports: [
    transport,
  ],
});

const customLogger = {};

const methods = [
  'log',
  'info',
  'error',
];

methods.forEach((name) => {
  customLogger[name] = function (...args) { // eslint-disable-line func-names
    const fileName = getFileNameWithLineNumber(args);
    logger[name].apply(logger, [fileName, ...args]);
  };
});

/**
 * Parses and returns info about the call stack at the given index.
 * Source: https://gist.github.com/fisch0920/39a7edc77c422cbf8a18
 */
function getStackInfo(stackIndex) {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  const stacklist = (new Error()).stack.split('\n').slice(3);

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  const s = stacklist[stackIndex] || stacklist[0];
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n'),
    };
  }

  return undefined;
}
/**
 * Attempts to add file and line number info to the given log arguments.
 */
function getFileNameWithLineNumber() {
  const stackInfo = getStackInfo(1);
  let calleeStr = '';
  if (stackInfo) {
    // get file path relative to project root
    calleeStr = `${stackInfo.relativePath} : ${stackInfo.line}`;
  }
  return calleeStr;
}



module.exports = customLogger;
