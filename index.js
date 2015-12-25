'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const proc = require('child_process')
const fs = require('fs')

// npm
const ansi = require('ansi-styles')
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
    if (!this.running && this.command) {
      this.running = true
      this.runs += 1
      this.clear().on('close', this.run.bind(this))
      setTimeout(() => this.running = false, 50)
    }
  }

  /**
    Log colorized header that displays time of last run, duration script
    has been running, and amount of times script has run.
   */
  header() {
    const now = new Date()
    const strs =
      [ `First Run │ ${this.startTime}`
      , `Last Run  │ ${util.extractTime(now)}`
      , `Elapsed   | ${util.duration(this.startTimestamp, now)}`
      , `Runs      │ ${this.runs}`
      ]
    const len = util.longestStr(strs)
    const fill = '═'.repeat(len)
    console.log(
      strs
        .map(util.pad(len))
        .map(util.wrap)
        .reverse()
        .concat(`${ansi.blue.open}╔═${fill}═╗`)
        .reverse()
        .concat(`╚═${fill}═╝${ansi.blue.close}`)
        .join('\n')
    )
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
      this.parseCommand(pkg.run)
      this.watch(pkg.watch)
    })
  }

  /**
    Split a command into this.command and this.args for running with
      child_process.spawn().

    @param {String} command - command to run
   */
  parseCommand(command) {
    const ar = command.split(' ')
    this.command = ar.shift()
    if (ar.length) this.args = ar
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
    this.header()
    this.args
      ? proc.spawn(this.command, this.args, {stdio: 'inherit'})
      : proc.spawn(this.command, {stdio: 'inherit'})
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
