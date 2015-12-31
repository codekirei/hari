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

//----------------------------------------------------------
// fns
//----------------------------------------------------------
// TODO jsdoc
const clear = () => process.spawn('clear', {stdio: 'inherit'})

/**
  Convert 24 hour notation to 12 hour notation.

  @param {Number} num - hours to convert
  @returns {Number} converted hours
  */
const parseHours = num => num > 12 ? num - 12 : num

// TODO jsdoc
/**
  Log colorized header that displays time of last run, duration script
  has been running, and amount of times script has run.
  */
function header(startTime, timestamp, runCount) {
  const now = new Date()
  const strs =
    [ `First Run │ ${startTime}`
    , `Last Run  │ ${parseTime(now)}`
    , `Elapsed   │ ${timeDiff(timestamp, now)}`
    , `Runs      │ ${runCount}`
    ]
  const len = longestStr(strs)
  const fill = '═'.repeat(len)
  return strs
    .map(padStrs(len))
    .map(wrap)
    .reverse()
    .concat(`${ansi.blue.open}╔═${fill}═╗`)
    .reverse()
    .concat(`╚═${fill}═╝${ansi.blue.close}`)
    .join('\n')
}

/**
  Parse milliseconds between two unix timestamps.

  @param {Number} from - timestamp to start from
  @param {Number} to - timestamp after elapsed time
  @returns {String} H:M:S passed
  */
const timeDiff = (from, to) => parseMs(to - from)

/**
  Find character count of longest string in array.

  @param {String[]} ar - array of strings
  @returns {Number} number of characters in longest string
  */
const longestStr = ar =>
  ar.reduce((prev, cur) => {
    const len = cur.length
    return len > prev ? len : prev
  }, 0)

// TODO jsdoc
const parseTime = dateOb =>
  [ parseHours(dateOb.getHours())
  , parseDigit(dateOb.getMinutes())
  , parseDigit(dateOb.getSeconds())
  ].join(':')

const padStrs = max => str => padStr(str, str.length, max)

const padStr = (str, len, max) =>
  max > len ? str + ' '.repeat(max - len) : str

// TODO jsdoc
const shift = ar => [ar.shift(), ar]

const readJson = path =>
  P.promisify(fs.readFile)(path, 'utf8').then(json => JSON.parse(json))

// TODO jsdoc
const buildCmdFn = ar =>
  ar[1]
    ? () => process.spawn(ar[0], ar[1], {stdio: 'inherit'})
    : () => process.spawn(ar[0], {stdio: 'inherit'})

const parseCmd = cmd => buildCmdFn(shift(cmd.split(' ')))

const wrap = str => `║ ${str} ║`

/**
  Convert milliseconds to hours, minutes, and seconds.

  @param {Number} ms - a number of milliseconds
  @returns {String} H:M:S
  */
const parseMs = ms =>
  [ Math.floor(ms / 3600000)
  , parseDigit(Math.floor(ms / 60000 % 60))
  , parseDigit(Math.floor(ms / 1000 % 60))
  ].join(':')

/**
  Prepend a leading 0 to single-digit times.

  @param {Number} num - number to potentially prepend
  @returns {String|Number}
  */
const parseDigit = num => num.toString().length === 1 ? `0${num}` : num

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { buildCmdFn
  , clear
  , header
  , longestStr
  , padStr
  , padStrs
  , parseCmd
  , parseDigit
  , parseHours
  , parseMs
  , parseTime
  , readJson
  , shift
  , timeDiff
  , wrap
  }
