'use strict'

// modules
//----------------------------------------------------------
import Hari from '../'
import test from 'ava'
import sinon from 'sinon'
import {EventEmitter} from 'events'
import childProcess from 'child_process'

// tests
//----------------------------------------------------------
test('constructor', t => {
  const hari = new Hari()
  const clock = sinon.useFakeTimers()
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
  const hari = new Hari()
  t.is(hari.convertHours(12), 0)
  t.is(hari.convertHours(13), 1)
  t.is(hari.convertHours(7), 7)
})

test('debounce', t => {
  // setup
  const clock = sinon.useFakeTimers()
  const hari = new Hari()
  const clear = sinon.stub(hari, 'clear', () => new EventEmitter())
  const run = sinon.stub(hari, 'run')
  hari.command = true
  hari.debounce()
  t.true(hari.running, 'running')
  t.is(hari.runs, 1, 'runs')
  clock.tick(50)
  t.false(hari.running, 'stopped running')
})
