'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'
import sinon from 'sinon'

// local
import { convertHours
       , duration
       , longestStr
       , parseMs
       , prepTime
       } from '../lib/utils'

//----------------------------------------------------------
// test
//----------------------------------------------------------
test('convertHours', t => {
  t.is(convertHours(13), 1)
  t.is(convertHours(7), 7)
})

test('duration', t => {
  const clock = sinon.useFakeTimers()
  const from = Date.parse(new Date()) // 0
  let to

  // tests
  clock.tick(3000)
  to = Date.parse(new Date())
  t.is(
    duration(from, to)
    , parseMs(3000)
  )
  clock.tick(4000)
  to = Date.parse(new Date())
  t.is(
    duration(from, to)
    , parseMs(7000)
  )

  // cleanup
  clock.restore()
})

test('longestStr', t =>
  t.is(longestStr(['one', 'two', 'three', 'four']), 5)
)

test.skip('padStrs', t =>
  t.same(
    padStrs(['a', 'b ', 'c  '], 3)
    , ['a  ', 'b  ', 'c  ']
  )
)

test('parseMs', t => {
  t.is(parseMs(1000), '0:00:01')
  t.is(parseMs(62500), '0:01:02')
  t.is(parseMs(3723000), '1:02:03')
  t.is(parseMs(36123000), '10:02:03')
})

test('prepTime', t => {
  t.is(prepTime('12'), '12')
  t.is(prepTime('3'), '03')
})
