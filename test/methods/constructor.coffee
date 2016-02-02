'use strict'

describe 'constructor', ->
  it 'bind props', ->
    hari = new Hari()
    pairs =
      [ [ hari.cmd, undefined ]
      , [ hari.debounce, undefined ]
      , [ hari.running, false ]
      , [ hari.runs, 0 ]
      , [ hari.startTime, undefined ]
      , [ hari.subP, undefined ]
      , [ hari.timestamp, undefined ]
      ]

    test = (pair) -> assert.equal pair[0], pair[1]

    test pair for pair in pairs
