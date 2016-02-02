'use strict'

describe 'digit', ->

  it 'prepend', ->
    actual = time.digit 1
    expected = '01'
    assert.equal actual, expected

  it 'noop', ->
    actual = time.digit 10
    expected = 10
    assert.equal actual, expected
