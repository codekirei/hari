'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const proc = require('child_process')
const fs = require('fs')

// npm
const chokidar = require('chokidar')
const chalk = require('chalk')
const P = require('bluebird')

//----------------------------------------------------------
// logic
//----------------------------------------------------------
module.exports = class Hari {
  constructor() {
    this.running = false
    this.runs = 0
    this.start = void 0
    this.now = void 0
    this.command = void 0
    this.args = void 0
  }

  /**
    Clear terminal with 'clear'.

    @returns {Object} child_process object
   */
  clear() {
    return proc.spawn('clear', {stdio: 'inherit'})
  }

  /**
    Convert 24 hour notation to 12 hour notation.

    @param {Number} num - hours to convert
    @returns {Number} converted hours
   */
  convertHours(num) {
    return num >= 12 ? num - 12 : num
  }

  /**
    Run main loop (this.clear -> this.run). Prevents
      re-running for multiple near-simultaneous changes.
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
    Count and parse milliseconds passed since this.init().

    @returns {String} H:M:S passed
   */
  duration() {
    return this.parseMs(Date.parse(this.now) - this.start)
  }

  /**
    Log colorized header that displays time of last run, duration script
    has been running, and amount of times script has run.
   */
  header() {
    const strs =
      [ `Last Run │ ${this.time()}`
      , `Duration │ ${this.duration()}`
      , `Runs     │ ${this.runs}`
      ]
    const len = this.longestStr(strs)
    const fill = '═'.repeat(len)
    const padded = this.padStrs(strs, len)
    console.log(chalk.blue(
      [ `╔═${fill}═╗`
      , `║ ${padded[0]} ║`
      , `║ ${padded[1]} ║`
      , `║ ${padded[2]} ║`
      , `╚═${fill}═╝`
      ].join('\n')))
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
    this.start = Date.parse(new Date())
    return this.readPkg().then(pkg => {
      this.parseCommand(pkg.run)
      this.watch(pkg.watch)
    })
  }

  /**
    Find character count of longest string in array.

    @param {String[]} ar - array of strings
    @returns {Number} number of characters in longest string
   */
  longestStr(ar) {
    return ar.reduce((prev, cur) => {
      const len = cur.length
      return len > prev ? len : prev
    }, 0)
  }

  /**
    Append spaces to strings as necessary so all strings are same length.

    @param {String[]} ar - array of strings
    @param {Number} max - number of characters in longest string in ar
    @returns {String[]} array of padded strings
   */
  padStrs(ar, max) {
    return ar.map(str => {
      const len = str.length
      if (len < max) str += ' '.repeat(max - len)
      return str
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
    Convert milliseconds to hours, minutes, and seconds.

    @param {Number} ms - a number of milliseconds
    @returns {String} H:M:S
   */
  parseMs(ms) {
    let rem = ms
    const h = Math.floor(rem / 3600000)
    rem %= 3600000
    const m = this.prepTime(Math.floor(rem / 60000))
    rem %= 60000
    const s = this.prepTime(Math.floor(rem / 1000))
    return [h, m, s].join(':')
  }

  /**
    Prepend a leading 0 to single-digit times.

    @param {Number} num - number to potentially prepend
    @returns {String} number converted to string and prepended if necessary
   */
  prepTime(num) {
    const str = num.toString()
    return str.length === 1 ? `0${str}` : str
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
    this.now = new Date()
    this.header()
    this.args
      ? proc.spawn(this.command, this.args, {stdio: 'inherit'})
      : proc.spawn(this.command, {stdio: 'inherit'})
  }

  /**
    Format new Date() (this.now) to H:M:S.

    @returns {String} H:M:S
   */
  time() {
    const h = this.convertHours(this.now.getHours())
    const m = this.prepTime(this.now.getMinutes())
    const s = this.prepTime(this.now.getSeconds())
    return [h, m, s].join(':')
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
