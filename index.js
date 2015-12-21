'use strict'

// modules
//----------------------------------------------------------
const chokidar = require('chokidar')
const spawn = require('child_process').spawn
const clor = require('clor')

// state vars
//----------------------------------------------------------
let running = false
let count = 0

// clear term
//----------------------------------------------------------
const log = data => console.log(data.toString())
const clear = () => spawn('clear').stdout.on('data', log)

// store time
//----------------------------------------------------------
const scale = num => num > 12 ? num - 12 : num
const prepend = num => num.length === 1 ? `0${num}` : num

function time() {
  const now = new Date()
  const h = scale(now.getHours())
  const m = prepend(now.getMinutes().toString())
  const s = prepend(now.getSeconds().toString())
  return `${h}:${m}:${s}`
}

// build header
//----------------------------------------------------------
function header(ct) {
  const delim = `||${'-'.repeat(58)}`
  const bars = '|| '
  clor
    .blue(delim).line
    .blue(bars).blue(`Time: ${time()}`).line
    .blue(bars).blue(`Count: ${ct}`).line
    .blue(delim).log()
}

// run script
//----------------------------------------------------------
function run() {
  header(count)
  // spawn('ava', {stdio: 'inherit'})
  // spawn('node', ['_old_test/test.js'], {stdio: 'inherit'})
}

// debounce
//----------------------------------------------------------
function debounce() {
  if (!running) {
    running = true
    count += 1
    clear().on('close', run)
    setTimeout(() => running = false, 50)
  }
}

// watch files
//----------------------------------------------------------
chokidar.watch([
  // 'index.js',
  // 'test/**/*.js',
  // 'lib/**/*.js',
  // '_old_test/**/*.js'
]).on('all', debounce)
