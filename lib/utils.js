'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const fs = require('fs')
const child = require('child_process')

// npm
const P = require('bluebird')
const billboard = require('multiline-billboard')

// local
const time = require('./time')

//----------------------------------------------------------
// fns
//----------------------------------------------------------
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
  return billboard(strs, {justify: 'left'})
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
    .catch(e => {
      throw new Error(e)
    })

/**
  Build child.spawn fn from array of command and args.

  @param {Array} ar - ['command', ['-flag'...]]
  @returns {Function} fn that calls child.spawn
 */
const buildCmdFn = ar =>
  ar[1]
    ? () => child.spawn(ar[0], ar[1], {stdio: 'inherit'})
    : () => child.spawn(ar[0], {stdio: 'inherit'})

/**
  Build child.spawn fn from space delimited command and args.

  @param {String} cmd - 'command -flag...'
  @returns {Function} fn that calls child.spawn
 */
const parseCmd = cmd => buildCmdFn(shift(cmd.split(' ')))

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { buildCmdFn
  , header
  , parseCmd
  , readJson
  , shift
  }
