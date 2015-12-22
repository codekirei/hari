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
    this.reps = 0
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
      this.reps += 1
      this.clear().on('close', this.run.bind(this))
      setTimeout(() => this.running = false, 50)
    }
  }

  // TODO jsdoc
  header(reps) {
    const delim = `||${'-'.repeat(58)}`
    const bars = '|| '
    clor
      .blue(delim).line
      .blue(bars).blue(`Time: ${this.time()}`).line
      .blue(bars).blue(`Reps: ${reps}`).line
      .blue(delim).log()
  }

  // TODO jsdoc
  init() {
    return this.readPkg().then(pkg => {
      this.parseScript(pkg.hari.run)
      this.watch(pkg.hari.watch)
    })
  }

  // TODO jsdoc
  parseScript(script) {
    const ar = script.split(' ')
    this.script = ar.shift()
    if (ar.length) this.args = ar
  }

  // TODO jsdoc
  prepTime(num) {
    return num.length === 1 ? `0${num}` : num
  }

  // TODO jsdoc
  readPkg() {
    return P.promisify(fs.readFile)('./package.json', 'utf8')
      .then(json => JSON.parse(json))
  }

  // TODO jsdoc
  run() {
    this.header(this.reps)
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
    const now = new Date()
    const h = this.scaleTime(now.getHours())
    const m = this.prepTime(now.getMinutes().toString())
    const s = this.prepTime(now.getSeconds().toString())
    return `${h}:${m}:${s}`
  }

  // TODO jsdoc
  watch(globs) {
    return chokidar.watch(globs).on('all', this.debounce.bind(this))
  }
}
