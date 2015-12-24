'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'

// local
import Hari from '../'

//----------------------------------------------------------
// hooks
//----------------------------------------------------------
let hari
test.before(t => hari = new Hari())

//----------------------------------------------------------
// test
//----------------------------------------------------------
test('convertHours', t => {
  t.is(hari.convertHours(12), 0)
  t.is(hari.convertHours(13), 1)
  t.is(hari.convertHours(7), 7)
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

test('parseMs', t => {
  t.is(hari.parseMs(1000), '0:00:01')
  t.is(hari.parseMs(62500), '0:01:02')
  t.is(hari.parseMs(3723000), '1:02:03')
  t.is(hari.parseMs(36123000), '10:02:03')
})

test('prepTime', t => {
  t.is(hari.prepTime(12), '12', 'stringified')
  t.is(hari.prepTime(3), '03', 'prepended')
})
