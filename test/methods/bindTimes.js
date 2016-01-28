'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const assert = require('chai').assert
const sinon = require('sinon')

// local
const Hari = require('../../')
const time = require('../../lib/time')

//----------------------------------------------------------
// tests
//----------------------------------------------------------
module.exports = describe('bindTimes', () => {
  it('bind to props', () => {
    // prep
    const hari = new Hari()
    assert.equal(hari.startTime, void 0)
    assert.equal(hari.timestamp, void 0)
    const clock = sinon.useFakeTimers()
    const now = new Date()

    // tests
    hari.bindTimes(now)
    assert.equal(hari.startTime, time.fromOb(now))
    assert.equal(hari.timestamp, Date.parse(now))

    // clean
    clock.restore()
  })
})
