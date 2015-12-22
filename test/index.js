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

// local
import Hari from '../'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('constructor', t => {
  const hari = new Hari()
  t.is(hari.running, false, 'running')
  t.is(hari.runs, 0, 'runs')
  t.is(hari.start, void 0, 'start')
  t.is(hari.now, void 0, 'now')
  t.is(hari.command, void 0, 'command')
  t.is(hari.args, void 0, 'args')
})

test('clear', t => {
  const hari = new Hari()
  const stub = sinon.stub(proc, 'spawn')
  hari.clear()
  t.true(stub.called)
  t.true(stub.calledWith('clear'))
  stub.restore()
})

test('convertHours', t => {
  const hari = new Hari()
  t.is(hari.convertHours(12), 0)
  t.is(hari.convertHours(13), 1)
  t.is(hari.convertHours(7), 7)
})

test('debounce', t => {
  const hari = new Hari()
  const clock = sinon.useFakeTimers()
  const clear = sinon.stub(hari, 'clear', () => new EventEmitter())
  const run = sinon.stub(hari, 'run')
  hari.command = true
  hari.debounce()

  // tests
  t.true(hari.running, 'running')
  t.is(hari.runs, 1, 'runs')
  clock.tick(50)
  t.false(hari.running, 'stopped running')

  // cleanup
  clock.restore()
})

test('duration', t => {
  const clock = sinon.useFakeTimers()
  const hari = new Hari()
  const stub = sinon.stub(hari, 'parseMs')
  hari.start = Date.parse(new Date())
  hari.now = new Date()
  hari.now.setSeconds(3)
  hari.duration()

  // tests
  t.true(stub.called, 'call parseMs')
  t.true(stub.calledWith(3000), 'call parseMs with correct value')

  // cleanup
  clock.restore()
})

test('header', t => {
})

test.skip('init', t => {
})

test('longestStr', t => {
  const hari = new Hari()
  t.is(hari.longestStr(['one', 'two', 'three', 'four']), 5)
})

test('padStrs', t => {
  const hari = new Hari()
  t.same(
    hari.padStrs(['a', 'b ', 'c  '], 3)
    , ['a  ', 'b  ', 'c  ']
  )
})

test('parseCommand', t => {
  const hari = new Hari()
  hari.parseCommand('npm test -v')
  t.is(hari.command, 'npm', 'command')
  t.same(hari.args, ['test', '-v'], 'args')
})

test.skip('parseMs', t => {
})

test('prepTime', t => {
  const hari = new Hari()
  t.is(hari.prepTime(12), '12', 'stringified')
  t.is(hari.prepTime(3), '03', 'prepended')
})

test.skip('readPkg', t => {
})

test.skip('run', t => {
})

test.skip('time', t => {
})

test.skip('watch', t => {
})
