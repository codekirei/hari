'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const chokidar = require('chokidar')

// local
const util = require('./lib/utils')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
function hari() {
  let running = false
  let runs = 0
  let cmd = void 0
  const initDate = new Date()
  const startTime = util.parseTime(initDate)
  const timestamp = Date.parse(initDate)

  const run = () => {
    console.log(util.header(startTime, timestamp, runs))
    cmd()
  }

  const debounce = () => {
    if (!running && cmd) {
      running = true
      runs += 1
      util.clear().on('close', run)
      setTimeout(() => running = false, 50)
    }
  }

  return util.readJson('./package.json').then(pkg => {
    cmd = util.parseCmd(pkg.hari.run)
    return chokidar.watch(pkg.hari.watch).on('all', debounce)
  })
}

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports = hari
