'use strict'

describe 'fromOb', ->
  it 'convert date object to string', ->
    actual = time.fromOb new Date()
    expected = '4:00:00'
    assert.equal actual, expected
