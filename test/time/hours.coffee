'use strict'

describe 'hours', ->

  it '> 12', ->
    actual = time.hours 14
    expected = 2
    assert.equal actual, expected

  it '<= 12', ->
    actual = time.hours 12
    expected = 12
    assert.equal actual, expected
