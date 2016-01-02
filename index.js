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
// logic
//----------------------------------------------------------
module.exports = class Hari {
  constructor() {
    this.running = false
    this.runs = 0
    this.cmd = void 0
    this.startTime = void 0
    this.timestamp = void 0
    return this
  }

  bindTimes(date) {
    this.startTime = time.fromOb(date)
    this.timestamp = Date.parse(date)
  }

  debounce() {
    if (!this.running && this.cmd) {
      this.running = true
      this.runs += 1
      util.clear().on('close', this.print.bind(this))
      setTimeout(() => this.running = false, 50)
    }
  }

  init() {
    return util.readJson('./package.json')
      .then(ob => {
        this.bindTimes(new Date())
        this.cmd = util.parseCmd(ob.hari.run)
        return chokidar.watch(ob.hari.watch).on('all', this.debounce.bind(this))
      })
      .catch(e => console.log(e.stack))
  }

  print() {
    console.log(util.header(this.startTime, this.timestamp, this.runs))
    this.cmd()
  }
}
