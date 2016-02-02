'use strict'

describe 'fromMs', ->

  it 'convert ms to string', ->
    pairs =
      [ [ 77777777, '21:36:17' ]
      , [ 7777777, '2:09:37' ]
      , [ 777777, '0:12:57' ]
      , [ 77777, '0:01:17' ]
      , [ 7777, '0:00:07' ]
      ]

    test = (pair) ->
      actual = time.fromMs pair[0]
      expected = pair[1]
      assert.equal actual, expected

    test pair for pair in pairs
