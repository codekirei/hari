'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const proc = require('child_process')

// npm
const ansi = require('ansi-styles')

//----------------------------------------------------------
// fns
//----------------------------------------------------------
/**
  Convert 24 hour notation to 12 hour notation.

  @param {Number} num - hours to convert
  @returns {Number} converted hours
  */
const convertHours = num => num > 12 ? num - 12 : num

// TODO jsdoc
/**
  Log colorized header that displays time of last run, duration script
  has been running, and amount of times script has run.
  */
function header(startTime, timestamp, runCount) {
  const now = new Date()
  const strs =
    [ `First Run │ ${startTime}`
    , `Last Run  │ ${extractTime(now)}`
    , `Elapsed   | ${duration(timestamp, now)}`
    , `Runs      │ ${runCount}`
    ]
  const len = longestStr(strs)
  const fill = '═'.repeat(len)
  return strs
    .map(pad(len))
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
const duration = (from, to) => parseMs(to - from)

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
const extractTime = dateOb =>
  [ convertHours(dateOb.getHours())
  , prepTime(dateOb.getMinutes().toString())
  , prepTime(dateOb.getSeconds().toString())
  ].join(':')

const pad = max => str => padStr(str, str.length, max)

const padStr = (str, len, max) =>
  max > len ? str + ' '.repeat(max - len) : str

// TODO jsdoc
const shift = ar => [ar.shift(), ar]

// TODO jsdoc
const split = str => str.split(' ')

// TODO jsdoc
const prepCmd = cmd => shift(split(cmd))

const spawnCmd = ar => ar.length > 1
  ? () => proc.spawn(ar[0], ar[1], {stdio: 'inherit'})
  : () => proc.spawn(ar[0], {stdio: 'inherit'})

const bindCmd = cmd => spawnCmd(prepCmd(cmd))

const wrap = str => `║ ${str} ║`

/**
  Convert milliseconds to hours, minutes, and seconds.

  @param {Number} ms - a number of milliseconds
  @returns {String} H:M:S
  */
const parseMs = ms => {
  let rem = ms
  const h = Math.floor(rem / 3600000)
  rem %= 3600000
  const m = prepTime((Math.floor(rem / 60000)).toString())
  rem %= 60000
  const s = prepTime((Math.floor(rem / 1000)).toString())
  return [h, m, s].join(':')
}

/**
  Prepend a leading 0 to single-digit times.

  @param {String} str - stringified number to potentially prepend
  @returns {String} potentially prepended string
  */
const prepTime = str => str.length === 1 ? `0${str}` : str

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { bindCmd
  , convertHours
  , duration
  , extractTime
  , header
  , longestStr
  , pad
  , padStr
  , parseMs
  , prepCmd
  , prepTime
  , shift
  , split
  , spawnCmd
  , wrap
  }
