'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'
import sinon from 'sinon'

// local
import Hari from '../../'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('constructor', t => {
  const hari = new Hari()
  t.false(hari.running)
  t.is(hari.runs, 0)
  t.is(hari.cmd, void 0)
  t.is(hari.startTime, void 0)
  t.is(hari.timestamp, void 0)
})
