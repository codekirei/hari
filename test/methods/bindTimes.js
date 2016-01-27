'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'
import sinon from 'sinon'

// local
import Hari from '../../'
import time from '../../lib/time'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('bindTimes', t => {
  // setup
  const hari = new Hari()
  t.is(hari.startTime, void 0)
  t.is(hari.timestamp, void 0)
  const clock = sinon.useFakeTimers()
  const now = new Date()

  // tests
  hari.bindTimes(now)
  t.is(hari.startTime, time.fromOb(now))
  t.is(hari.timestamp, Date.parse(now))

  // cleanup
  clock.restore()
})
