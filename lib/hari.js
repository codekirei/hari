'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const spawn = require('child_process').spawn
const fs = require('fs')

// npm
const chokidar = require('chokidar')
const clor = require('clor')
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
    this.script = void 0
    this.args = void 0
  }

  // TODO jsdoc
  clear() {
    return spawn('clear', {stdio: 'inherit'})
  }

  // TODO jsdoc
  debounce() {
    if (!this.running) {
      this.running = true
      this.runs += 1
      this.clear().on('close', this.run.bind(this))
      setTimeout(() => this.running = false, 50)
    }
  }

  // TODO jsdoc
  duration() {
    return this.parseMs(Date.parse(this.now) - this.start)
  }

  // TODO jsdoc
  header() {
    const strs =
      [ `Last Run │ ${this.time()}`
      , `Duration │ ${this.duration()}`
      , `Runs     │ ${this.runs}`
      ]
    const len = this.longestStr(strs)
    const fill = '═'.repeat(len)
    const padded = this.padStrs(strs, len)
    clor
      .blue(`╔═${fill}═╗`).line
      .blue(`║ ${padded[0]} ║`).line
      .blue(`║ ${padded[1]} ║`).line
      .blue(`║ ${padded[2]} ║`).line
      .blue(`╚═${fill}═╝ `).log()
  }

  // TODO jsdoc
  init() {
    this.start = Date.parse(new Date())
    return this.readPkg().then(pkg => {
      this.parseScript(pkg.hari.run)
      this.watch(pkg.hari.watch)
    })
  }

  longestStr(ar) {
    let longest = 0
    ar.map(str => {
      const len = str.length
      if (len > longest) longest = len
    })
    return longest
  }

  padStrs(ar, max) {
    return ar.map(str => {
      const len = str.length
      if (len < max) str += ' '.repeat(max - len)
      return str
    })
  }

  // TODO jsdoc
  parseMs(ms) {
    let rem = ms
    const h = Math.floor(rem / 3600000)
    rem %= 3600000
    const m = this.prepTime(Math.floor(rem / 60000))
    rem %= 60000
    const s = this.prepTime(Math.floor(rem / 1000))
    return [h, m, s].join(':')
  }

  // TODO jsdoc
  parseScript(script) {
    const ar = script.split(' ')
    this.script = ar.shift()
    if (ar.length) this.args = ar
  }

  // TODO jsdoc
  prepTime(num) {
    num = num.toString()
    return num.length === 1 ? `0${num}` : num
  }

  // TODO jsdoc
  readPkg() {
    return P.promisify(fs.readFile)('./package.json', 'utf8')
      .then(json => JSON.parse(json))
  }

  // TODO jsdoc
  run() {
    this.now = new Date()
    this.header()
    this.args
      ? spawn(this.script, this.args, {stdio: 'inherit'})
      : spawn(this.script, {stdio: 'inherit'})
  }

  // TODO jsdoc
  scaleTime(num) {
    return num > 12 ? num - 12 : num
  }

  // TODO jsdoc
  time() {
    const h = this.scaleTime(this.now.getHours())
    const m = this.prepTime(this.now.getMinutes())
    const s = this.prepTime(this.now.getSeconds())
    return [h, m, s].join(':')
  }

  // TODO jsdoc
  watch(globs) {
    return chokidar.watch(globs).on('all', this.debounce.bind(this))
  }
}
