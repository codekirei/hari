'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
import {EventEmitter} from 'events'
import proc from 'child_process'

// npm
import sinon from 'sinon'
import test from 'ava'
import ansi from 'ansi-styles'
import chokidar from 'chokidar'
import mockfs from 'mock-fs'

// local
import Hari from '../'
import utils from '../lib/utils'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test.skip('constructor', t => {
  const hari = new Hari()
  t.is(hari.running, false)
  t.is(hari.runs, 0)
  t.is(hari.start, void 0)
  t.is(hari.command, void 0)
  t.is(hari.args, void 0)
})

test.skip('clear', t => {
  const hari = new Hari()
  sinon.stub(proc, 'spawn')
  hari.clear()
  t.true(proc.spawn.called)
  t.true(proc.spawn.calledWith('clear'))
  proc.spawn.restore()
})

test.skip('debounce', t => {
  const hari = new Hari()
  const clock = sinon.useFakeTimers()
  const clear = sinon.stub(hari, 'clear').returns(new EventEmitter())
  const run = sinon.stub(hari, 'run')

  // tests
  hari.debounce()
  t.is(hari.runs, 0)
  hari.command = true
  hari.debounce()
  t.true(hari.running)
  t.is(hari.runs, 1)
  t.true(clear.called)
  t.false(run.called)
  clear().emit('close')
  t.true(run.called)
  clock.tick(50)
  t.false(hari.running)

  // cleanup
  clock.restore()
})

test.skip('header', t => {
  const hari = new Hari()
  const clock = sinon.useFakeTimers()
  hari.start = Date.parse(new Date())
  hari.now = new Date()
  sinon.spy(hari, 'time')
  sinon.spy(utils, 'duration')
  sinon.spy(utils, 'longestStr')
  sinon.spy(utils, 'padStrs')
  sinon.stub(console, 'log')
  hari.header()

  // tests
  t.true(hari.time.called)
  t.true(utils.duration.called)
  t.true(utils.longestStr.called)
  t.true(utils.padStrs.called)
  t.true(console.log.called)
  const header = console.log.args[0][0].split('\n')
  const open = ansi.blue.open
  const close = ansi.blue.close
  t.is(header[0], `${open}╔════════════════════╗`)
  t.is(header[1],        '║ Last Run │ 4:00:00 ║')
  t.is(header[2],        '║ Duration │ 0:00:00 ║')
  t.is(header[3],        '║ Runs     │ 0       ║')
  t.is(header[4],        `╚════════════════════╝${close}`)

  // cleanup
  clock.restore()
  console.log.restore()
})

test.skip('init', async t => {
  const clock = sinon.useFakeTimers()
  const hari = new Hari()
  const pkg =
    { watch: ['**/*.js']
    , run: 'npm test'
    }
  sinon.stub(hari, 'readPkg', () => Promise.resolve(pkg))
  sinon.stub(hari, 'parseCommand')
  sinon.stub(hari, 'watch')
  t.is(hari.start, void 0)
  await hari.init()
  t.is(hari.start, 0)
  t.true(hari.readPkg.called)
  t.true(hari.parseCommand.called)
  t.true(hari.parseCommand.calledWith(pkg.run))
  t.true(hari.watch.called)
  t.true(hari.watch.calledWith(pkg.watch))
  clock.restore()
})

test.skip('parseCommand', t => {
  const hari = new Hari()
  hari.parseCommand('./test')
  t.is(hari.command, './test')
  hari.parseCommand('npm test -v')
  t.is(hari.command, 'npm')
  t.same(hari.args, ['test', '-v'])
})

test.skip('readPkg', async t => {
  mockfs({ 'package.json':
`{
  "hari": {
    "watch": [
      "**/*.js"
    ],
    "run": "npm test"
  }
}`
  })
  const hari = new Hari()
  t.same(
    await hari.readPkg()
    , { watch: [ '**/*.js' ], run: 'npm test' }
  )
  mockfs.restore()
})

test.skip('run', t => {
  const clock = sinon.useFakeTimers()
  const hari = new Hari()
  sinon.stub(hari, 'header')
  sinon.stub(proc, 'spawn')
  hari.command = true

  // hari.args is undefined
  hari.run()
  t.true(hari.header.called)
  t.true(proc.spawn.calledOnce)
  t.is(proc.spawn.firstCall.args.length, 2)

  // hari.args is defined
  hari.args = true
  hari.run()
  t.true(proc.spawn.calledTwice)
  t.is(proc.spawn.secondCall.args.length, 3)

  // cleanup
  clock.restore()
  proc.spawn.restore()
})

test.skip('time', t => {
  const clock = sinon.useFakeTimers()
  const hari = new Hari()
  sinon.spy(hari, 'time')
  sinon.spy(utils, 'convertHours')
  sinon.spy(utils, 'prepTime')
  hari.now = new Date()
  sinon.spy(hari.now, 'getHours')
  sinon.spy(hari.now, 'getMinutes')
  sinon.spy(hari.now, 'getSeconds')

  // tests
  t.is(hari.time(), '4:00:00')
  t.true(utils.convertHours.called)
  t.true(utils.prepTime.calledTwice)
  t.true(hari.now.getHours.called)
  t.true(hari.now.getMinutes.called)
  t.true(hari.now.getSeconds.called)

  // cleanup
  clock.restore()
})

test.skip('watch', t => {
  const hari = new Hari()
  sinon.spy(chokidar, 'watch')
  sinon.stub(hari, 'debounce')
  const glob = ['./fixture']
  hari.watch(glob)
  t.true(chokidar.watch.called)
  t.true(chokidar.watch.calledWith(glob))
  t.false(hari.debounce.called)
  proc.spawn('touch', glob).on('done', () =>
    t.true(hari.debounce.called)
  )
  chokidar.watch.restore()
})
