'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const assert = require('chai').assert
const sinon = require('sinon')

// local
const time = require('../lib/time')

//----------------------------------------------------------
// tests
//----------------------------------------------------------
describe('lib/time', () => {
  // hooks
  //----------------------------------------------------------
  let clock
  beforeEach(() => clock = sinon.useFakeTimers())
  afterEach(() => clock.restore())

  // diff
  //----------------------------------------------------------
  describe('diff', () => {
    it('call time.fromMs with correct param', () => {
      // prep
      sinon.spy(time, 'fromMs')
      const from = new Date()
      clock.tick(100)
      const to = new Date()

      // test
      time.diff(from, to)
      assert.isTrue(time.fromMs.calledWith(to - from))

      // clean
      time.fromMs.restore()
    })
  })

  // digit
  //----------------------------------------------------------
  describe('digit', () => {
    it('prepend', () =>
       assert.equal(time.digit(1), '01'))
    it('noop', () =>
      assert.equal(time.digit(10), 10))
  })

  // fromMs
  //----------------------------------------------------------
  describe('fromMs', () => {
    it('convert ms count to H:M:S string', () => {
      const pairs =
        [ [ 77777777, '21:36:17' ]
        , [ 7777777, '2:09:37' ]
        , [ 777777, '0:12:57' ]
        , [ 77777, '0:01:17' ]
        , [ 7777, '0:00:07']
        ]
      pairs.map(pair =>
        assert.equal(time.fromMs(pair[0]), pair[1]))
    })
  })

  // fromOb
  //----------------------------------------------------------
  describe('fromOb', () => {
    it('convert date object to H:M:S string', () =>
      assert.equal(time.fromOb(new Date()), '4:00:00'))
  })

  // hours
  //----------------------------------------------------------
  describe('hours', () => {
    it('> 12', () =>
      assert.equal(time.hours(14), 2))
    it('<= 12', () =>
      assert.equal(time.hours(12), 12))
  })
})
