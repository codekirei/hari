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
// TODO jsdoc
const clear = () => process.spawn('clear', {stdio: 'inherit'})

// TODO jsdoc
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
  , parseCmd
  , readJson
  , shift
  }
