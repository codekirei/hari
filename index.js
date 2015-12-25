'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const fs = require('fs')
const proc = require('child_process')

// npm
const chokidar = require('chokidar')
const P = require('bluebird')

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
    return proc.spawn('clear', {stdio: 'inherit'})
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
    return this.readPkg().then(pkg => {
      // const cmd = util.prepCmd(pkg.run)
      // split this into spawn cmd util
      // this.cmd = () => cmd[1]
      //   ? proc.spawn(cmd[0], cmd[1], {stdio: 'inherit'})
      //   : proc.spawn(cmd[0], {stdio: 'inherit'})
      this.cmd = util.bindCmd(pkg.run)
      return this.watch(pkg.watch)
    })
  }

  /**
    Read and parse package.json.

    @returns {Promise} promise that reads and parses package.json
   */
  readPkg() {
    return P.promisify(fs.readFile)('./package.json', 'utf8')
      .then(json => JSON.parse(json).hari)
  }

  /**
    Print header and spawn this.command with this.args.
   */
  run() {
    console.log(util.header(this.startTime, this.timestamp, this.runs))
    this.cmd()
  }

  /**
    Watch globs with chokidar and run this.debounce on changes.

    @param {String[]} globs - array of globs to watch
    @returns {Object} chokidar FSWatcher object
   */
  watch(globs) {
    return chokidar.watch(globs).on('all', this.debounce.bind(this))
  }
}
