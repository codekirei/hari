'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
import Emitter from 'events'

// npm
import test from 'ava'
import sinon from 'sinon'
import mock from 'mock-fs'
import restoreCursor from 'restore-cursor'
import chokidar from 'chokidar'

// local
import Hari from '../../../'
import util from '../../../lib/utils'

//----------------------------------------------------------
// tests
//----------------------------------------------------------

// mock fs
//----------------------------------------------------------
const content =
  `{ "hari":
    { "run": "node test.js"
    , "watch": "test.js"
    }
  }`

// hooks
//----------------------------------------------------------
let clock

test.before(t => {
  sinon.stub(chokidar, 'watch').returns(new Emitter())
  mock({ 'package.json': content })
  clock = sinon.useFakeTimers()
})

test.after(t => {
  chokidar.watch.restore()
  mock.restore()
  clock.restore()
})

// cases
//----------------------------------------------------------
test('read - success', async t => {
  const hari = new Hari()
  const res = await hari.init()
  t.ok(res)
})

test('bind times', async t => {
  const hari = new Hari()
  sinon.stub(hari, 'bindTimes')
  await hari.init()
  t.true(hari.bindTimes.calledWith(new Date()))
})

test('parse cmd', async t => {
  const hari = new Hari()
  sinon.stub(util, 'parseCmd').returns('test')
  t.is(hari.cmd, void 0)
  await hari.init()
  t.true(util.parseCmd.calledWith('node test.js'))
  t.is(hari.cmd, 'test')
})

test('watch with chokidar', async t => {
  const hari = new Hari()
  await hari.init()
  t.true(chokidar.watch.calledWith('test.js'))
})

test('chokidar - event cb', async t => {
  // setup
  const hari = new Hari()
  sinon.stub(hari, 'print')
  const watcher = await hari.init()

  // tests
  t.false(hari.print.called)
  t.is(hari.debounce, void 0)
  watcher.emit('all')
  t.not(hari.debounce, void 0)

  // clean up
  hari.print.restore()
})
