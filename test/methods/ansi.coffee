'use strict'

describe 'ansi', ->

  ps = process.stdout
  hari = undefined

  before -> hari = new Hari()

  beforeEach -> sinon.stub ps, 'write'

  afterEach -> ps.write.restore() if ps.write.restore

  it 'string param', ->
    hari.ansi('H')
    actual = ps.write.args[0][0]
    expected = '\u001b[H'
    ps.write.restore()
    assert.equal actual, expected

  it 'array param', ->
    hari.ansi(['foo', 'bar'])
    actual =
      [ ps.write.args[0][0]
      , ps.write.args[1][0]
      ]
    expected =
      [ '\u001b[foo'
      , '\u001b[bar'
      ]
    ps.write.restore()
    test = (i) ->
      assert.ok actual[i]
      assert.ok expected[i]
      assert.equal actual[i], expected[i]
    test i for str, i in actual
