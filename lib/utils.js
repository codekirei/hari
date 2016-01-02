'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const fs = require('fs')
const process = require('child_process')

// npm
const ansi = require('ansi-styles')
const P = require('bluebird')

// local
const time = require('./time')
const str = require('./str')

//----------------------------------------------------------
// fns
//----------------------------------------------------------
/**
  Clear terminal with 'clear' child process.

  @returns {Object} ChildProcess object
 */
const clear = () => process.spawn('clear', {stdio: 'inherit'})

/**
  Build header.

  @param {String} startTime - H:M:S start time
  @param {Number} timestamp - unix timestamp in milliseconds
  @param {Number} runCount  - accumulator
  @returns {String} header
 */
function header(startTime, timestamp, runCount) {
  const now = new Date()
  const strs =
    [ `First Run │ ${startTime}`
    , `Last Run  │ ${time.fromOb(now)}`
    , `Elapsed   │ ${time.diff(timestamp, now)}`
    , `Runs      │ ${runCount}`
    ]
  const len = str.longest(strs)
  const fill = '═'.repeat(len)
  return strs
    .map(str.pad(len))
    .map(str.wrap('║'))
    .reverse()
    .concat(`${ansi.blue.open}╔═${fill}═╗`)
    .reverse()
    .concat(`╚═${fill}═╝${ansi.blue.close}`)
    .join('\n')
}

/**
  [a, b, c] -> [a, [b, c]]

  @param {Array} ar - array to modify
  @returns {Array} modified array
 */
const shift = ar => [ar.shift(), ar]

/**
  Read and parse JSON file at path.

  @param {String} path - path to file
  @returns {Object} - parsed JSON
 */
const readJson = path =>
  P.promisify(fs.readFile)(path, 'utf8')
    .then(json => JSON.parse(json))
    .catch(e => {throw new Error(e)})

/**
  Build process.spawn fn from array of command and args.

  @param {Array} ar - ['command', ['-flag'...]]
  @returns {Function} fn that calls process.spawn
 */
const buildCmdFn = ar =>
  ar[1]
    ? () => process.spawn(ar[0], ar[1], {stdio: 'inherit'})
    : () => process.spawn(ar[0], {stdio: 'inherit'})

/**
  Build process.spawn fn from space delimited command and args.

  @param {String} cmd - 'command -flag...'
  @returns {Function} fn that calls process.spawn
 */
const parseCmd = cmd => buildCmdFn(shift(cmd.split(' ')))

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { buildCmdFn
  , clear
  , header
  , parseCmd
  , readJson
  , shift
  }
