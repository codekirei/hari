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
import chalk from 'chalk'
import chokidar from 'chokidar'

// local
import Hari from '../'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('constructor', t => {
  const hari = new Hari()
  t.is(hari.running, false)
  t.is(hari.runs, 0)
  t.is(hari.start, void 0)
  t.is(hari.now, void 0)
  t.is(hari.command, void 0)
  t.is(hari.args, void 0)
})

test('clear', t => {
  const hari = new Hari()
  sinon.stub(proc, 'spawn')
  hari.clear()
  t.true(proc.spawn.called)
  t.true(proc.spawn.calledWith('clear'))
  proc.spawn.restore()
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
  const clear = sinon.stub(hari, 'clear').returns(new EventEmitter())
  const run = sinon.stub(hari, 'run')
  hari.command = true
  hari.debounce()

  // tests
  t.true(hari.running, 'running')
  t.is(hari.runs, 1, 'runs')
  t.true(clear.called)
  t.false(run.called)
  clear().emit('close')
  t.true(run.called)
  clock.tick(50)
  t.false(hari.running, 'stopped running')

  // cleanup
  clock.restore()
})

test('duration', t => {
  const hari = new Hari()
  const clock = sinon.useFakeTimers()
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
  const hari = new Hari()
  const clock = sinon.useFakeTimers()
  hari.start = Date.parse(new Date())
  hari.now = new Date()
  sinon.spy(hari, 'time')
  sinon.spy(hari, 'duration')
  sinon.spy(hari, 'longestStr')
  sinon.spy(hari, 'padStrs')
  sinon.stub(console, 'log')
  hari.header()

  // tests
  t.true(hari.time.called)
  t.true(hari.duration.called)
  t.true(hari.longestStr.called)
  t.true(hari.padStrs.called)
  t.true(console.log.called)
  t.true(console.log.calledWith(chalk.blue(
    [ '╔════════════════════╗'
    , '║ Last Run │ 4:00:00 ║'
    , '║ Duration │ 0:00:00 ║'
    , '║ Runs     │ 0       ║'
    , '╚════════════════════╝'
    ].join('\n')
  )))

  // cleanup
  clock.restore()
  console.log.restore()
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

test('parseMs', t => {
  const hari = new Hari()
  t.is(hari.parseMs(1000), '0:00:01')
  t.is(hari.parseMs(62500), '0:01:02')
  t.is(hari.parseMs(3723000), '1:02:03')
  t.is(hari.parseMs(36123000), '10:02:03')
})

test('prepTime', t => {
  const hari = new Hari()
  t.is(hari.prepTime(12), '12', 'stringified')
  t.is(hari.prepTime(3), '03', 'prepended')
})

test.skip('readPkg', t => {
})

test('run', t => {
  const clock = sinon.useFakeTimers()
  const hari = new Hari()
  sinon.stub(hari, 'header')
  sinon.stub(proc, 'spawn')
  hari.command = true
  t.is(hari.now, void 0)

  // args is undefined
  hari.run()
  t.is(Date.parse(hari.now), 0)
  t.true(hari.header.called)
  t.true(proc.spawn.calledOnce)
  t.is(proc.spawn.firstCall.args.length, 2)

  // args is defined
  hari.args = true
  hari.run()
  t.true(proc.spawn.calledTwice)
  t.is(proc.spawn.secondCall.args.length, 3)

  // cleanup
  clock.restore()
  proc.spawn.restore()
})

test('time', t => {
  const clock = sinon.useFakeTimers()
  const hari = new Hari()
  sinon.spy(hari, 'time')
  sinon.spy(hari, 'convertHours')
  sinon.spy(hari, 'prepTime')
  hari.now = new Date()
  sinon.spy(hari.now, 'getHours')
  sinon.spy(hari.now, 'getMinutes')
  sinon.spy(hari.now, 'getSeconds')

  // tests
  t.is(hari.time(), '4:00:00')
  t.true(hari.convertHours.called)
  t.true(hari.prepTime.calledTwice)
  t.true(hari.now.getHours.called)
  t.true(hari.now.getMinutes.called)
  t.true(hari.now.getSeconds.called)

  // cleanup
  clock.restore()
})

test.skip('watch', t => {
})
