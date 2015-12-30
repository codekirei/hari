'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const process = require('child_process')

// local
const util = require('./lib/utils')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
module.exports = class Hari {
  constructor() {
    this.running = false
    this.runs = 0
  }

  /**
    Clear terminal with 'clear'.

    @returns {Object} child_process object
   */
  clear() {
    return process.spawn('clear', {stdio: 'inherit'})
  }

  /**
    Run main loop (this.clear -> this.run). Prevents
      re-running after multiple near-simultaneous changes.
   */
  debounce() {
    if (!this.running && this.cmd) {
      this.running = true
      this.runs += 1
      this.clear().on('close', this.run.bind(this))
      setTimeout(() => this.running = false, 50)
    }
  }

  /**
    Initialize hari.
      1. Save start time to this.start
      2. Read package.json (for hari.run and hari.watch)
      3. Bind this.command and this.args with this.parseCommand
      4. Start watching globs with this.watch

    @returns {Promise} promisified main loop
   */
  init() {
    const date = new Date()
    this.startTime = util.extractTime(date)
    this.timestamp = Date.parse(date)
    return util.readJson('./package.json').then(pkg => {
      this.cmd = util.bindCmd(pkg.hari.run)
      return util.watch(pkg.hari.watch, this.debounce, this)
    })
  }

  /**
    Print header and spawn this.command with this.args.
   */
  run() {
    console.log(util.header(this.startTime, this.timestamp, this.runs))
    this.cmd()
  }
}
