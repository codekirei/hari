'use strict'

describe 'bindTimes', ->

  before -> clock.freeze()
  after -> clock.restore()

  it 'bind to props', ->
    hari = new Hari()
    now = new Date()
    assert.typeOf hari.startTime, 'undefined'
    assert.typeOf hari.timestamp, 'undefined'
    hari.bindTimes(now)
    assert.equal hari.startTime, time.fromOb(now)
    assert.equal hari.timestamp, now.valueOf()
