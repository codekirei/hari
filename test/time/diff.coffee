'use strict'

describe 'diff', ->
  it 'call time.fromMs with correct param', ->
    sinon.spy time, 'fromMs'
    from = new Date()
    clock.tick 100
    to = new Date()
    time.diff from, to
    assert.isTrue time.fromMs.calledWith to - from
