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

// strings
//----------------------------------------------------------
const wrap = str => `║ ${str} ║`

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

const padStrs = max => str => padStr(str, str.length, max)

const padStr = (str, len, max) =>
  max > len ? str + ' '.repeat(max - len) : str

// other
//----------------------------------------------------------
// TODO jsdoc
const clear = () => process.spawn('clear', {stdio: 'inherit'})

// TODO jsdoc
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
