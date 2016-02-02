'use strict'

describe 'shift', ->
  it '[a, b, c] => [a, [b, c]]', ->
    actual = utils.shift(['a', 'b', 'c'])
    expected = ['a', ['b', 'c']]
    assert.deepEqual actual, expected
