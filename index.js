'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const chokidar = require('chokidar')

// local
const util = require('./lib/utils')
const time = require('./lib/time')

//----------------------------------------------------------
// vars
//----------------------------------------------------------
let cmd
  , initDate
  , startTime
  , timestamp

let running = false
let runs = 0

//----------------------------------------------------------
// fns
//----------------------------------------------------------
const hari = () => util.readJson('./package.json').then(init)

const debounce = () => {
  if (!running && cmd) {
    running = true
    runs += 1
    util.clear().on('close', run)
    setTimeout(() => running = false, 50)
  }
}

const init = ob => {
  initDate = new Date()
  startTime = time.fromOb(initDate)
  timestamp = Date.parse(initDate)
  cmd = util.parseCmd(ob.hari.run)
  return chokidar.watch(ob.hari.watch).on('all', debounce)
}

const run = () => {
  console.log(util.header(startTime, timestamp, runs))
  cmd()
}

//----------------------------------------------------------
// export
//----------------------------------------------------------
module.exports = Object.assign(hari, {run, debounce, init})
