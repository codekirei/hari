'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'
import sinon from 'sinon'

// local
import time from '../lib/time'

//----------------------------------------------------------
// tests
//----------------------------------------------------------

// diff
//----------------------------------------------------------
test('diff', t => {
  // prep
  const clock = sinon.useFakeTimers()
  sinon.spy(time, 'fromMs')

  // assign date objects
  const from = new Date()
  clock.tick()
  const to = new Date()

  // test
  time.diff(from, to)
  t.true(time.fromMs.calledWith(from - to))

  // cleanup
  time.fromMs.restore()
  clock.restore()
})

// digit
//----------------------------------------------------------
test('digit - prepend', t => t.is(time.digit(1), '01'))
test('digit - do not prepend', t => t.is(time.digit(10), 10))

// fromMs
//----------------------------------------------------------
test('fromMs', t => {
  t.is(time.fromMs(77777777), '21:36:17')
  t.is(time.fromMs(7777777), '2:09:37')
  t.is(time.fromMs(777777), '0:12:57')
  t.is(time.fromMs(77777), '0:01:17')
  t.is(time.fromMs(7777), '0:00:07')
})

// fromOb
//----------------------------------------------------------
test('fromOb', t => {
  const clock = sinon.useFakeTimers()
  t.is(time.fromOb(new Date()), '4:00:00')
  clock.restore()
})

// hours
//----------------------------------------------------------
test('hours - >12', t => t.is(time.hours(14), 2))
test('hours - <=12', t => t.is(time.hours(12), 12))
