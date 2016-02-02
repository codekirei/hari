'use strict'

describe 'header', ->
  it 'build header with multiline-billboard', ->
    clock.freeze()
    content =
      [ 'First Run │ 4:00:00'
      , 'Last Run  │ 4:00:00'
      , 'Elapsed   │ 0:00:00'
      , 'Runs      │ 0'
      ]
    actual = utils.header '4:00:00', new Date(), 0
    expected = billboard(content, justify: 'left') + EOL
    clock.restore()
    assert.equal actual, expected
