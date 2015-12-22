'use strict'

// modules
//----------------------------------------------------------
import Hari from '../'
import test from 'ava'
import sinon from 'sinon'

// setup
//----------------------------------------------------------
const hari = new Hari()
const clock = sinon.useFakeTimers()

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
