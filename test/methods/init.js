'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'
import sinon from 'sinon'
import mock from 'mock-fs'
import restoreCursor from 'restore-cursor'

// local
import Hari from '../../'
import util from '../../lib/utils'

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
test.before(t => {
  sinon.stub(console, 'log')
  mock(
    { 'package.json': mock.file({ content }) }
  )
})

test.beforeEach(t => {
  t.context.hari = new Hari()
  t.context.print = sinon.stub(t.context.hari, 'print')
})

test.afterEach(t => {
  t.context.print.restore()
})

test.after(t => {
  console.log.restore()
  mock.restore()
})

// cases
//----------------------------------------------------------
// test('restore cursor', t => {})

test('read package.json - success', async t => {
  const hari = t.context.hari
  const res = await hari.init()
  t.ok(res)
})

// test('read package.json - error', t => {})

test('bind times', async t => {
  const hari = t.context.hari
  const clock = sinon.useFakeTimers()
  sinon.stub(hari, 'bindTimes')
  await hari.init()
  t.true(hari.bindTimes.calledWith(new Date()))
  clock.restore()
})

test('parse cmd', async t => {
  const hari = t.context.hari
  sinon.stub(util, 'parseCmd').returns('test')
  t.is(hari.cmd, void 0)
  await hari.init()
  t.true(util.parseCmd.calledWith('node test.js'))
  t.is(hari.cmd, 'test')
})

// test('return chokidar watcher', t => {})

// test('chokidar - event cb', t => {})

// test('chokidar - setTimeout cb', t => {})
