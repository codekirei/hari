'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
import {EventEmitter} from 'events'
import childProcess from 'child_process'

// npm
import sinon from 'sinon'
import test from 'ava'

// local
import Hari from '../'

//----------------------------------------------------------
// hooks
//----------------------------------------------------------
let hari
let clock

test.beforeEach(t => {
  hari = new Hari()
  clock = sinon.useFakeTimers()
})

test.afterEach(t => {
  hari = void 0
  clock.restore()
})

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('constructor', t => {
  hari.init()
  t.is(hari.running, false, 'running')
  t.is(hari.runs, 0, 'runs')
  t.is(hari.start, 0, 'start')
  t.is(hari.now, void 0, 'now')
  t.is(hari.command, void 0, 'command')
  t.is(hari.args, void 0, 'args')
})

test.skip('clear', t => {
})

test('convertHours', t => {
  t.is(hari.convertHours(12), 0)
  t.is(hari.convertHours(13), 1)
  t.is(hari.convertHours(7), 7)
})

test('debounce', t => {
  const clear = sinon.stub(hari, 'clear', () => new EventEmitter())
  const run = sinon.stub(hari, 'run')
  hari.command = true
  hari.debounce()
  t.true(hari.running, 'running')
  t.is(hari.runs, 1, 'runs')
  clock.tick(50)
  t.false(hari.running, 'stopped running')
})

test('duration', t => {
  const stub = sinon.stub(hari, 'parseMs')
  hari.start = Date.parse(new Date())
  hari.now = new Date()
  hari.now.setSeconds(3)
  hari.duration()
  t.true(stub.called, 'call parseMs')
  t.true(stub.calledWith(3000), 'call parseMs with correct value')
})

test.skip('header', t => {
})

test.skip('init', t => {
})

test('longestStr', t =>
  t.is(hari.longestStr(['one', 'two', 'three', 'four']), 5)
)

test('padStrs', t =>
  t.same(
    hari.padStrs(['a', 'b ', 'c  '], 3)
    , ['a  ', 'b  ', 'c  ']
  )
)

test('parseCommand', t => {
  hari.parseCommand('npm test -v')
  t.is(hari.command, 'npm', 'command')
  t.same(hari.args, ['test', '-v'], 'args')
})

test.skip('parseMs', t => {
})

test('prepTime', t => {
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
